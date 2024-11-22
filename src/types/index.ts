import { z } from "zod";
import { transactionSchema } from "@/lib/schemas";

export interface Transaction extends z.infer<typeof transactionSchema> {
  _id: string;
  createdAt: string;
}
