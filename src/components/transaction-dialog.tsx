"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { transactionSchema } from "@/lib/schemas";
import {
  initialTransactionData,
  expenseCategories,
  incomeCategories,
  transactionTypes,
  recursionPeriods,
} from "@/lib/constants";
import { Transaction } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const TransactionDialog = ({
  open,
  onOpenChange,
  mode,
  transaction,
  username,
}: {
  open: boolean;
  onOpenChange: () => void;
  mode: "create" | "edit" | "";
  transaction: Transaction | null;
  username: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialTransactionData as Partial<
      z.infer<typeof transactionSchema>
    >,
  });

  useEffect(() => {
    if (mode === "edit" && transaction) {
      form.reset(transaction);
    } else {
      form.reset(
        initialTransactionData as Partial<z.infer<typeof transactionSchema>>
      );
    }
  }, [mode, transaction, form]);

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    setIsPending(true);

    if (mode === "create") {
      const res = await createTransaction({ username, ...values });

      if (res.success) {
        toast(res.message);
        onOpenChange();
      } else {
        toast(res.message, {
          action: {
            label: "Try again",
            onClick: () => form.handleSubmit(onSubmit)(),
          },
        });
      }

      setIsPending(false);
    } else if (mode === "edit" && transaction) {
      const res = await updateTransaction({
        _id: transaction._id,
        username,
        ...values,
      });

      if (res.success) {
        toast(res.message);
        onOpenChange();
      } else {
        toast(res.message);
      }

      setIsPending(false);
    }
  };

  const isRecursive = form.watch("isRecursive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(800px,90vh)] max-w-[min(1300px,90vw)] flex-col rounded-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add a transaction"
              : mode === "edit"
                ? "Edit your transaction"
                : null}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? "Add the details of your financial transaction below. Include essential information like amount, category, and date. For recurring expenses like rent or subscriptions, you can set up automatic tracking by enabling the recurring option."
              : mode === "edit"
                ? "Modify your transaction details as needed. Any changes you make will be reflected in your financial summary and reports. Take care when editing recurring transactions, as this will affect future entries."
                : null}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full flex-1 auto-rows-min grid-cols-1 gap-4 overflow-auto border-b border-t border-border px-1 py-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, specific name for your transaction that helps you
                    identify it later. Examples: &apos;Monthly Rent
                    Payment&apos;, &apos;Freelance Project - Client Name&apos;,
                    or &apos;Grocery Shopping - Walmart&apos;.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Additional details about your transaction that provide
                    context or important information. Include relevant details
                    like payment methods, invoice numbers, or specific items
                    purchased.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    The total monetary value of your transaction. For expenses,
                    enter the amount paid. For income, enter the amount
                    received. Use positive numbers only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.setValue(
                        "category",
                        "" as unknown as
                          | (typeof expenseCategories)[number]
                          | (typeof incomeCategories)[number]
                      );
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-left capitalize">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] w-auto sm:max-h-[400px]">
                      {transactionTypes.map((type) => (
                        <SelectItem
                          className="capitalize"
                          key={type}
                          value={type}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify whether this is money coming in (Income) or going
                    out (Expense). This determines available categories and
                    affects your overall balance calculation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const selectedType = form.watch("type");
                const categoryList =
                  selectedType === "expense"
                    ? expenseCategories
                    : selectedType === "income"
                      ? incomeCategories
                      : ["Please choose transaction type first"];

                return (
                  <FormItem>
                    <FormLabel>Transaction Category</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        if (e !== "Please choose transaction type first") {
                          field.onChange(e);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-left capitalize">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px] w-auto capitalize sm:max-h-[400px]">
                        {categoryList.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the most appropriate category for your transaction.
                      This helps in generating accurate financial reports and
                      tracking spending patterns. Categories differ based on
                      whether this is an income or expense.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className="flex w-full justify-start"
                          variant="outline"
                        >
                          {field.value ? (
                            new Date(field.value).toLocaleDateString("tr-TR")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="single"
                        onSelect={(e) => {
                          if (e === undefined) {
                            field.onChange("");
                          } else {
                            field.onChange(e.toISOString());
                          }
                        }}
                        selected={new Date(field.value)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When the transaction occurred or is scheduled to occur. For
                    recurring transactions, this will be used as the start date
                    for future occurrences.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRecursive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Recursive</FormLabel>
                  <FormControl>
                    <div className="flex items-start gap-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          form.setValue("recursionPeriod", undefined);
                        }}
                      />
                      <FormDescription>
                        Enable this for regular, repeating transactions like
                        monthly rent, salary, or subscription payments. This
                        helps in automatic tracking of recurring expenses or
                        income.
                      </FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRecursive ? (
              <FormField
                control={form.control}
                name="recursionPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recursion Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-left capitalize">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px] w-auto capitalize sm:max-h-[400px]">
                        {Object.values(recursionPeriods).map((period) => (
                          <SelectItem key={period} value={period}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often this transaction repeats. Choose daily for
                      everyday expenses, monthly for regular bills or salary, or
                      yearly for annual payments like insurance or
                      subscriptions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <button type="submit" className="hidden" />
          </form>
        </Form>
        <DialogFooter className="h-max gap-4">
          <Button onClick={onOpenChange} variant="outline">
            Close
          </Button>
          <Button
            disabled={isPending}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
