"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkAuth } from "@/actions/auth";
import { getCollection } from "@/lib/mongo";
import { limitsFormSchema } from "@/lib/schemas";
import { limitsFormInitialValues } from "@/lib/constants";

export const createLimits = async ({ username }: { username: string }) => {
  try {
    const collection = await getCollection("limits");

    const doesLimitsConfigExists = await collection.findOne({ username });

    if (doesLimitsConfigExists) {
      return {
        success: false,
        message: "Limit configuration already exists for this user.",
      };
    }

    await collection.insertOne({
      username,
      ...limitsFormInitialValues,
    });

    return {
      success: true,
      message: `Limits configuration initialized for user: ${username}.`,
    };
  } catch (error) {
    console.error("/limits/createLimits error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const getLimits = async () => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated) {
      return { success: false, message: "Not Authorized." };
    }

    const collection = await getCollection("limits");

    const limits = await collection.findOne({ username });

    return { success: true, limits, message: "Limits fetched successfully." };
  } catch (error) {
    console.error("/limits/getLimits error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const updateLimits = async ({
  limits,
}: {
  limits: z.infer<typeof limitsFormSchema>;
}) => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated) {
      return { success: false, message: "Not Authorized." };
    }

    const collection = await getCollection("limits");

    const res = await collection.findOneAndUpdate(
      { username },
      { $set: limits }
    );

    if (res) revalidatePath("/");

    return res
      ? { success: true, message: "Limits configuration updated successfully." }
      : { success: false, message: "Limits could not be updated." };
  } catch (error) {
    console.error("/limits/updateLimits error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
