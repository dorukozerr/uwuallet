"use server";

import { z } from "zod";
import { clientPromise } from "@/lib/mongo";
import { transactionSchema } from "@/lib/schemas";

const getCollection = async (collectionName: string) =>
  (await clientPromise).db("expense-tracker").collection(collectionName);

export const createTransaction = async (
  payload: z.infer<typeof transactionSchema>
) => {
  const parsedPayload = transactionSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return { success: false, message: "Invalid payload." };
  }

  const collection = await getCollection("transactions");

  const res = await collection.insertOne({
    ...parsedPayload.data,
    date: new Date(parsedPayload.data.date),
  });

  if (res.acknowledged) {
    return { success: true, message: "Transaction added successfully." };
  } else {
    return {
      success: false,
      message: "Transaction could not be added, please try again.",
    };
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
