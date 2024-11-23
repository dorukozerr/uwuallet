"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { Transaction } from "@/types";
import { clientPromise } from "@/lib/mongo";
import { transactionFormSchema } from "@/lib/schemas";

// TODO - Update get collection func maybe, it always get transactions collection anyway
const getCollection = async (collectionName: string) =>
  (await clientPromise).db("expense-tracker").collection(collectionName);

export const createTransaction = async (
  payload: z.infer<typeof transactionFormSchema> & { username: string }
) => {
  try {
    const collection = await getCollection("transactions");

    const res = await collection.insertOne({
      ...payload,
      date: new Date(payload.date),
      endDate: payload.endDate ? new Date(payload.endDate) : payload.endDate,
    });

    if (res.acknowledged) revalidatePath("/");

    return res.acknowledged
      ? { success: true, message: "Transaction added successfully." }
      : { success: false, message: "Transaction could not be added." };
  } catch (error) {
    console.error("/transactions/createTransaction error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const getTransactions = async ({ username }: { username: string }) => {
  try {
    const collection = await getCollection("transactions");

    const transactions = await collection.find({ username }).toArray();

    return {
      success: true,
      message: "Transactions fetched successfully.",
      transactions,
    };
  } catch (error) {
    console.error("/transactions/getTransactions error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const updateTransaction = async ({ _id, ...newData }: Transaction) => {
  try {
    const collection = await getCollection("transactions");

    const res = await collection.findOneAndUpdate(
      { _id: new ObjectId(_id), username: newData.username },
      { $set: { ...newData, date: new Date(newData.date) } }
    );

    if (res) revalidatePath("/");

    return res
      ? { success: true, message: `Transaction ${_id} updated successfully.` }
      : { success: false, message: "Transaction could not be updated." };
  } catch (error) {
    console.error("/transactions/updateTransaction error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const deleteTransaction = async ({
  _id,
  username,
}: {
  _id: string;
  username: string;
}) => {
  try {
    const collection = await getCollection("transactions");

    const res = await collection.findOneAndDelete({
      username,
      _id: new ObjectId(_id),
    });

    if (res) revalidatePath("/");

    return res
      ? { success: true, message: `Transaction ${_id} deleted successfully.` }
      : { success: false, message: "Transaction could not be deleted." };
  } catch (error) {
    console.error("/transactions/deleteTransaction error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
