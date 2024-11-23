import { z } from "zod";
import { transactionFormSchema } from "@/lib/schemas";

export interface Transaction extends z.infer<typeof transactionFormSchema> {
  _id: string;
  username: string;
}
