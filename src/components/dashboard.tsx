"use client";

import { useState } from "react";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { populateTransactions } from "@/actions/transactions";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Transaction } from "@/types";
import { TransactionDialog } from "@/components/transaction-dialog";
import { DeleteTransactionDialog } from "@/components/delete-transaction-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Dashboard = ({
  username,
  transactions,
}: {
  username: string;
  transactions: Transaction[];
}) => {
  const { width } = useScreenSize();
  const [transactionDialogState, setTransactionDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit" | "";
    transaction: Transaction | null;
    username: string;
  }>({
    open: false,
    mode: "",
    transaction: null,
    username: "",
  });
  const [deleteTransactionDialogState, setDeleteTransactionDialogState] =
    useState<{ open: boolean; _id: string; username: string }>({
      open: false,
      _id: "",
      username: "",
    });

  console.log("transactions =>", transactions);

  return (
    <>
      <div className="mx-auto flex h-max w-full max-w-[1440px] flex-col items-start justify-start gap-4 p-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg font-bold capitalize sm:text-2xl">
            <span>Welcome {username}!</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={async () => {
                const res = await populateTransactions();
                toast(res.message);
              }}
            >
              Populate
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() =>
                setTransactionDialogState({
                  open: true,
                  mode: "create",
                  transaction: null,
                  username,
                })
              }
            >
              <PlusIcon className="h-[1.2rem] w-[1.2rem]" />
              <span>Add Transaction</span>
            </Button>
          </div>
        </div>
        <div className="h-[500px] w-full border border-red-500"></div>
        <div className="flex h-max w-full items-center justify-between border border-red-500">
          <h3 className="text-lg font-bold capitalize sm:text-2xl">
            Transactions
          </h3>
        </div>
        <div className="h-max w-full">
          {transactions.length ? (
            <div className="flex h-full w-full flex-col items-start justify-start gap-4">
              {transactions.map((transaction, index) => (
                <div
                  key={`transaction-${index}`}
                  className="relative flex h-max w-full flex-col items-start justify-start gap-2 rounded-md border border-border p-2 sm:gap-4 sm:p-4 lg:flex-row lg:items-center"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-2 max-h-7 min-h-7 min-w-7 max-w-7 sm:max-h-9 sm:min-h-9 sm:min-w-9 sm:max-w-9 lg:static"
                      >
                        <MoreHorizontalIcon className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align={width >= 1024 ? "start" : "end"}
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          setTransactionDialogState({
                            open: true,
                            mode: "edit",
                            transaction,
                            username,
                          })
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setDeleteTransactionDialogState({
                            open: true,
                            _id: transaction._id,
                            username,
                          })
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="w-full max-w-[100%] pr-12 lg:max-w-[50%] lg:pr-0">
                    <h3 className="text-sm font-bold capitalize sm:text-base">
                      {transaction.title}
                    </h3>
                    <h4 className="text-xs capitalize text-muted-foreground sm:text-sm">
                      {transaction.description}
                    </h4>
                  </div>
                  <div className="flex w-full flex-row-reverse items-center justify-between gap-2 sm:justify-end sm:gap-4 lg:flex-row">
                    <div className="w-max">
                      <h6 className="text-sm font-bold capitalize sm:text-base">
                        {transaction.category.replace(/([A-Z])/g, " $1").trim()}
                      </h6>
                      <div className="text-xs capitalize text-muted-foreground sm:text-sm">
                        {transaction.type}
                      </div>
                    </div>
                    <div className="mr-auto w-max lg:mr-0">
                      <h6 className="text-sm font-bold sm:text-base">
                        {transaction.type === "expense" ? "-" : "+"}{" "}
                        {transaction.amount.toLocaleString("tr-TR")} $
                      </h6>
                      <h5 className="text-xs text-muted-foreground sm:text-sm">
                        {new Date(transaction.date).toLocaleDateString("tr-TR")}
                      </h5>
                    </div>
                    <div
                      className={`rounded-full border border-border p-1 sm:p-2 ${transaction.type === "expense" ? "bg-red-100 dark:bg-red-800" : "bg-green-100 dark:bg-green-800"}`}
                    >
                      {transaction.type === "expense" ? (
                        <ArrowUpIcon className="h-[1.8rem] w-[1.8rem]" />
                      ) : transaction.type === "income" ? (
                        <ArrowDownIcon className="h-[1.8rem] w-[1.8rem]" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <h6 className="max-w-[400px] text-center text-lg sm:p-8 sm:text-xl">
                Currently you have no transaction record, please add some.
              </h6>
            </div>
          )}
        </div>
      </div>
      <TransactionDialog
        open={transactionDialogState.open}
        onOpenChange={() =>
          setTransactionDialogState({
            open: false,
            mode: "",
            transaction: null,
            username: "",
          })
        }
        mode={transactionDialogState.mode}
        transaction={transactionDialogState.transaction}
        username={username}
      />
      <DeleteTransactionDialog
        open={deleteTransactionDialogState.open}
        onOpenChange={() =>
          setDeleteTransactionDialogState({
            open: false,
            _id: "",
            username: "",
          })
        }
        _id={deleteTransactionDialogState._id}
        username={deleteTransactionDialogState.username}
      />
    </>
  );
};
