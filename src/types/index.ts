import { z } from "zod";
import { txFormSchema } from "@/lib/schemas";

export interface Transaction extends z.infer<typeof txFormSchema> {
  _id: string;
  username: string;
}
