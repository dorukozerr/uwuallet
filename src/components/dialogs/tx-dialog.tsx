"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  TextIcon,
  DollarSign,
  Calendar as CalendarIcon,
  RepeatIcon,
  Type,
  ArrowUpDown,
} from "lucide-react";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { txFormSchema } from "@/lib/schemas";
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

export const TxDialog = ({
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
  const form = useForm<z.infer<typeof txFormSchema>>({
    resolver: zodResolver(txFormSchema),
    defaultValues: initialTransactionData as Partial<
      z.infer<typeof txFormSchema>
    >,
  });

  useEffect(() => {
    if (mode === "edit" && transaction) {
      form.reset(transaction);
    } else {
      form.reset(
        initialTransactionData as Partial<z.infer<typeof txFormSchema>>
      );
    }
  }, [mode, transaction, form]);

  const onSubmit = async (values: z.infer<typeof txFormSchema>) => {
    setIsPending(true);

    const res =
      mode === "create"
        ? await createTransaction({ username, ...values })
        : mode === "edit"
          ? await updateTransaction({
              _id: transaction?._id || "",
              username,
              ...values,
            })
          : null;

    toast(res?.message || "Invalid dialog mode");

    if (res?.success) onOpenChange();

    setIsPending(false);
  };

  const isRecursive = form.watch("isRecursive");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(800px,95vh)] max-w-[min(1300px,95vw)] flex-col rounded-md p-4 sm:p-6">
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
                  <FormLabel className="flex items-center gap-2">
                    <TextIcon className="h-4 w-4" />
                    Title
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>
                        Give your transaction a clear, identifiable name.
                      </span>
                      <span className="flex flex-col gap-1">
                        <span>• Must be between 3-100 characters</span>
                        <span>• Use specific names for easier tracking</span>
                        <span>
                          • Avoid generic terms like &quot;Payment&quot; or
                          &quot;Bill&quot;
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Examples: &quot;Monthly Rent Payment&quot;,
                        &quot;Grocery Shopping - Walmart&quot;, &quot;Freelance
                        Work - Design Project&quot;
                      </span>
                    </span>
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
                  <FormLabel className="flex items-center gap-2">
                    <TextIcon className="h-4 w-4" />
                    Description
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>
                        Add details about your transaction for future reference.
                      </span>
                      <span className="flex flex-col gap-1">
                        <span>• Must be between 3-300 characters</span>
                        <span>
                          • Include relevant details like purpose or location
                        </span>
                        <span>
                          • Add notes that might be helpful for tracking
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Examples: &quot;Monthly rent payment for apartment
                        4B&quot;, &quot;Weekly grocery shopping including
                        household items&quot;, &quot;Frontend development work
                        for client project&qout;
                      </span>
                    </span>
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
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>Enter the transaction amount (minimum $1).</span>
                      <span className="flex flex-col gap-1">
                        <span>• Use numbers only (decimals allowed)</span>
                        <span>• Currency is USD</span>
                        <span>
                          • For recurring transactions, this amount will be used
                          for each occurrence
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Note: Use positive numbers regardless of transaction
                        type. The type selection (income/expense) will determine
                        if it&apos;s added or subtracted from your balance.
                      </span>
                    </span>
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
                  <FormLabel className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Transaction Type
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.setValue(
                        "category",
                        // TODO - look here and refactor it later.
                        // Code below annoys me a lot, what is the correct way
                        // to handle this, I cant just set it to empty string
                        "" as unknown as (typeof expenseCategories)[number]
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
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>
                        Select whether this is money coming in or going out.
                      </span>
                      <span className="flex flex-col gap-1">
                        <span>
                          • Income: Money you receive (salary, freelance work,
                          etc.)
                        </span>
                        <span>
                          • Expense: Money you spend (bills, shopping, etc.)
                        </span>
                        <span>
                          • This will affect available categories and balance
                          calculations
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Tip: The transaction type will determine the color
                        coding in your reports (green for income, red for
                        expenses).
                      </span>
                    </span>
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
                    <FormLabel className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Category
                      <span className="text-destructive">*</span>
                    </FormLabel>
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
                    <FormDescription className="text-sm text-muted-foreground">
                      <span className="flex flex-col gap-2">
                        <span>
                          Select a category that best matches your transaction.
                        </span>
                        <span className="flex flex-col gap-1">
                          <span>
                            • Categories change based on transaction type
                          </span>
                          <span>
                            • Used for generating spending reports and analytics
                          </span>
                          <span>• Helps track spending patterns over time</span>
                        </span>
                        <span className="rounded-md bg-muted/50 p-2 text-xs">
                          Example categories: Income: Salary, Freelance,
                          Investments Expenses: Bills, Food, Transportation
                        </span>
                      </span>
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
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Transaction Date
                    <span className="text-destructive">*</span>
                  </FormLabel>
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
                        onSelect={(e) =>
                          e === undefined
                            ? field.onChange("")
                            : field.onChange(e.toISOString())
                        }
                        selected={new Date(field.value)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>
                        Select when this transaction occurred or when it should
                        start if recurring.
                      </span>
                      <span className="flex flex-col gap-1">
                        <span>
                          • For one-time transactions: Choose the actual
                          transaction date
                        </span>
                        <span>
                          • For recurring transactions: This becomes the start
                          date
                        </span>
                        <span>
                          • Past dates are allowed for recording previous
                          transactions
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Example: For a monthly rent payment starting from
                        January, select January 1st as the date. For a coffee
                        you bought yesterday, simply select yesterday&apos;s
                        date.
                      </span>
                    </span>
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
                  <FormLabel className="flex items-center gap-2">
                    <RepeatIcon className="h-4 w-4" />
                    Recurring Transaction
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-start gap-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          form.setValue("recursionPeriod", undefined);
                          form.setValue("endDate", "");
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm text-muted-foreground">
                    <span className="flex flex-col gap-2">
                      <span>
                        Specify if this transaction repeats regularly.
                      </span>
                      <span className="flex flex-col gap-1">
                        <span>• Enable for regular payments or income</span>
                        <span>• Requires selecting a recursion period</span>
                        <span>
                          • Will create multiple transactions automatically
                        </span>
                      </span>
                      <span className="rounded-md bg-muted/50 p-2 text-xs">
                        Examples: Monthly rent payments, weekly allowance,
                        bi-weekly salary deposits
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRecursive ? (
              <>
                <FormField
                  control={form.control}
                  name="recursionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <RepeatIcon className="h-4 w-4" />
                        Frequency
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <FormDescription className="text-sm text-muted-foreground">
                        <span className="flex flex-col gap-2">
                          <span>How often should this transaction repeat?</span>
                          <span className="flex flex-col gap-1">
                            <span>• Required for recurring transactions</span>
                            <span>
                              • Choose from daily, weekly, monthly, or yearly
                            </span>
                            <span>
                              • Affects how transactions are created between
                              start and end dates
                            </span>
                          </span>
                          <span className="rounded-md bg-muted/50 p-2 text-xs">
                            Example: Selecting &quot;Monthly&quot; for rent
                            payment starting Jan 1st and ending Dec 31st will
                            create 12 transactions
                          </span>
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Recursion End Date
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className="flex w-full justify-start"
                              variant="outline"
                            >
                              {field.value ? (
                                new Date(field.value).toLocaleDateString(
                                  "tr-TR"
                                )
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
                            onSelect={(e) =>
                              e === undefined
                                ? field.onChange("")
                                : field.onChange(e.toISOString())
                            }
                            disabled={(date) =>
                              date < new Date(form.watch("date"))
                            }
                            selected={new Date(field.value || "")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        <span className="flex flex-col gap-2">
                          <span>
                            Optional field for recurring transactions. This date
                            determines when your recurring transaction will
                            stop.
                          </span>
                          <span className="flex flex-col gap-1">
                            <span>• Must be set after star date</span>
                            <span>
                              • Transactions will occur between start date and
                              end date
                            </span>
                            <span>
                              • Can be modified later through the edit
                              transaction dialog
                            </span>
                          </span>
                          <span className="rounded-md bg-muted/50 p-2 text-xs">
                            Example: For a monthly bill starting January 1st
                            with end date December 31st, the system will create
                            11 transactions automatically. You should select
                            next year&apos;s January 1st
                          </span>
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}
            <button type="submit" className="hidden" />
          </form>
        </Form>
        <DialogFooter className="h-max gap-4 sm:gap-0">
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
