"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
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

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg capitalize sm:text-xl">Welcome {username}!</h1>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() =>
                setTransactionDialogState({
                  open: true,
                  mode: "create",
                  transaction: null,
                  username,
                })
              }
            >
              Add Transaction
            </Button>
          </div>
        </div>
        <div className="w-full flex-1 overflow-auto">
          {transactions.length ? (
            <div className="flex h-full w-full flex-col items-start justify-start gap-4">
              {transactions.map((transaction, index) => (
                <div
                  key={`transaction-${index}`}
                  className="flex h-max w-full items-center justify-start gap-2 rounded-md border border-border p-4 sm:gap-4 md:gap-8"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontalIcon className="h-[1.2rem] w-[1.2rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
                  <div>
                    <h3 className="text-sm font-bold capitalize sm:text-base">
                      {transaction.title}
                    </h3>
                    <h4 className="text-xs capitalize text-muted-foreground sm:text-sm">
                      {transaction.description}
                    </h4>
                  </div>
                  <div className="flex-1" />
                  <div className="w-[150px]">
                    <h6 className="text-sm font-bold sm:text-base">
                      {transaction.category}
                    </h6>
                    <div className="text-xs capitalize text-muted-foreground sm:text-sm">
                      {transaction.type}
                    </div>
                  </div>
                  <div className="w-[150px]">
                    <h6 className="text-sm font-bold sm:text-base">
                      {transaction.type === "expense" ? "-" : "+"}{" "}
                      {transaction.amount.toLocaleString("tr-TR")} $
                    </h6>
                    <h5 className="text-xs text-muted-foreground sm:text-sm">
                      {new Date(transaction.date).toLocaleDateString("tr-TR")}
                    </h5>
                  </div>
                  <div
                    className={`rounded-full border border-border p-2 ${transaction.type === "expense" ? "bg-red-100 dark:bg-red-800" : "bg-green-100 dark:bg-green-800"}`}
                  >
                    {transaction.type === "expense" ? (
                      <ArrowUpIcon className="h-[1.8rem] w-[1.8rem]" />
                    ) : transaction.type === "income" ? (
                      <ArrowDownIcon className="h-[1.8rem] w-[1.8rem]" />
                    ) : null}
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
