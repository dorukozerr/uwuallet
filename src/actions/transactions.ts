"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { Transaction } from "@/types";
import { getCollection } from "@/lib/mongo";
import { txFormSchema } from "@/lib/schemas";
import { incrementByMonth } from "@/lib/utils";
import {
  expenseCategories,
  incomeCategories,
  recursionPeriods,
} from "@/lib/constants";

export const getTransactions = async ({ username }: { username: string }) => {
  try {
    const collection = await getCollection("transactions");

    const transactions = await collection
      .find({ username })
      .sort({ date: -1 })
      .toArray();

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

export const createTransaction = async (
  payload: z.infer<typeof txFormSchema> & { username: string }
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

export const updateTransaction = async ({
  _id,
  date,
  endDate,
  ...newData
}: Transaction) => {
  try {
    const collection = await getCollection("transactions");

    const res = await collection.findOneAndUpdate(
      { _id: new ObjectId(_id), username: newData.username },
      {
        $set: {
          ...newData,
          date: new Date(date),
          endDate: endDate ? new Date(endDate) : endDate,
        },
      }
    );

    if (res) revalidatePath("/");

    return res
      ? { success: true, message: "Transaction updated successfully." }
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
      ? { success: true, message: "Transaction deleted successfully." }
      : { success: false, message: "Transaction could not be deleted." };
  } catch (error) {
    console.error("/transactions/deleteTransaction error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const populateTransactions = async () => {
  try {
    const collection = await getCollection("transactions");
    const payload = [];
    const startDate = new Date(2010, 0, 1);

    payload.push({
      title: "Initial Income Title",
      description: "Initial Income Description",
      amount: 25000,
      type: "income",
      category: "salary",
      date: startDate,
      isRecursive: true,
      recursionPeriod: "monthly",
      endDate: "",
      username: "doruk",
    });

    for (let i = 1; i < 150; i++) {
      const randomType = Math.random() > 0.15 ? "expense" : "income";
      const randomCategory =
        randomType === "expense"
          ? expenseCategories[
              Math.floor(Math.random() * expenseCategories.length)
            ]
          : incomeCategories[
              Math.floor(Math.random() * incomeCategories.length)
            ];
      const amount = [100, 200, 250, 500, 750][Math.floor(Math.random() * 5)];
      const date = incrementByMonth(startDate, i);
      const isRecursive = Math.random() < 0.05;
      const recursionPeriod = isRecursive
        ? Object.values(recursionPeriods)[Math.floor(Math.random() * 3)]
        : null;
      const endDate = "";

      payload.push({
        title: `${randomType} Title ${i + 1}`,
        description: `${randomType} Description ${i + 1}`,
        amount,
        type: randomType,
        category: randomCategory,
        date: new Date(date),
        isRecursive,
        recursionPeriod,
        endDate,
        username: "doruk",
      });
    }

    await collection.insertMany(payload);

    revalidatePath("/");

    return {
      success: true,
      message: "Transactions populated successfully.",
    };
  } catch (error) {
    console.error("/transactions/populateTransactions error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
