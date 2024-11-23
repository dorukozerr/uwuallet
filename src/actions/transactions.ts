"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { Transaction } from "@/types";
import { clientPromise } from "@/lib/mongo";
import { transactionSchema } from "@/lib/schemas";

const getCollection = async (collectionName: string) =>
  (await clientPromise).db("expense-tracker").collection(collectionName);

export const createTransaction = async (
  payload: z.infer<typeof transactionSchema> & { username: string }
) => {
  const collection = await getCollection("transactions");

  const res = await collection.insertOne({
    ...payload,
    date: new Date(payload.date),
  });

  if (res.acknowledged) {
    revalidatePath("/");

    return { success: true, message: "Transaction added successfully." };
  } else {
    return { success: false, message: "Transaction could not be added." };
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

    return {
      success: false,
      message: "Unknown error happened.",
      transactions: [],
    };
  }
};

export const updateTransaction = async (
  payload: z.infer<typeof transactionSchema> & {
    _id: string;
    username: string;
  }
) => {
  try {
    const collection = await getCollection("transactions");

    const { _id, ...newData } = payload;

    const transaction = (await collection.findOne({
      _id: new ObjectId(payload._id),
    })) as Transaction | null;

    if (!transaction) {
      return { success: false, message: "Transaction not found." };
    }

    const res = await collection.updateOne(
      { _id: new ObjectId(payload._id), username: payload.username },
      { $set: { ...newData, date: new Date(newData.date) } }
    );

    if (res.matchedCount === 0) {
      return { success: false, message: "Transaction not found." };
    }

    if (res.modifiedCount === 0) {
      return {
        success: false,
        message: "No changes were made to the transaction.",
      };
    }

    revalidatePath("/");

    return {
      success: true,
      message: `Transaction ${_id} updated successfully.`,
    };
  } catch (error) {
    console.error("/transactions/updateTransaction error =>", error);

    return { success: false, message: "Failed to update transaction." };
  }
};
