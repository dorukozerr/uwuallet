import { z } from "zod";
import {
  expenseCategories,
  incomeCategories,
  transactionTypes,
  recursionPeriods,
} from "@/lib/constants";

export const authFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should be at least 3 character" })
    .max(50, { message: "Username can be maximum 50 character" }),
  password: z
    .string()
    .min(3, { message: "Password should be at least 3 character" })
    .max(50, { message: "Password can be maximum 50 character" }),
});

export const txFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .min(3, "Description must be at least 3 characters")
      .max(300, "Description cannot exceed 300 characters"),
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    type: z.enum(transactionTypes, {
      message: "Please select whether this is an income or expense",
    }),
    category: z.union([
      z.enum(expenseCategories, {
        message: "Please select a valid category for your transaction type",
      }),
      z.enum(incomeCategories, {
        message: "Please select a valid category for your transaction type",
      }),
    ]),
    date: z.string().min(24, "Please pick a date").max(27, "Invalid date"),
    isRecursive: z.boolean({
      message: "Please specify if this is a recurring transaction",
    }),
    recursionPeriod: z
      .nativeEnum(recursionPeriods, {
        message: "Please select how often this transaction repeats",
      })
      .nullish(),
    endDate: z.string().optional(),
  })
  .refine(
    ({ isRecursive, recursionPeriod }) =>
      isRecursive ? recursionPeriod : true,
    {
      message: "Please select how often this transaction repeats",
      path: ["recursionPeriod"],
    }
  );

export const limitsFormSchema = z.object({
  housing: z.coerce.number(),
  transportation: z.coerce.number(),
  healthcare: z.coerce.number(),
  living: z.coerce.number(),
  family: z.coerce.number(),
  leisure: z.coerce.number(),
  financial: z.coerce.number(),
  miscellaneous: z.coerce.number(),
});
