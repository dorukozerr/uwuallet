import { z } from "zod";
import { transactionCategories, transactionTypes } from "@/lib/constants";

export const authenticationFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should be at least 3 character." })
    .max(50, { message: "Username can be maximum 50 character." }),
  password: z
    .string()
    .min(3, { message: "Password should be at least 3 character." })
    .max(50, { message: "Password can be maximum 50 character." }),
});

export const transactionSchema = z.object({
  ownerUsername: z.string().min(3).max(50),
  category: z.enum(transactionCategories),
  type: z.enum(transactionTypes),
  amount: z.number().min(1),
  description: z.string().min(3).max(300),
  date: z.string().min(27).max(27),
  isRecursive: z.boolean(),
  recursionPeriod: z.enum(["daily", "monthly", "yearly"]).optional(),
});
