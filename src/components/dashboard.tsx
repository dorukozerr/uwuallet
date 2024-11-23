"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Transaction } from "@/types";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "./ui/button";

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
                  onClick={() =>
                    setTransactionDialogState({
                      open: true,
                      mode: "edit",
                      transaction,
                      username,
                    })
                  }
                  className="flex h-max w-full items-center justify-start gap-4 rounded-md border border-border p-4 sm:gap-8"
                >
                  <Button variant="outline" size="icon">
                    <MoreHorizontalIcon className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                  <div>
                    <h3 className="text-lg font-bold capitalize sm:text-2xl">
                      {transaction.title}
                    </h3>
                    <h4 className="text-base capitalize sm:text-lg">
                      {transaction.description}
                    </h4>
                  </div>
                  <div className="flex-1" />
                  <div className="w-[150px]">
                    <h6 className="text-lg font-semibold">
                      {transaction.category}
                    </h6>
                    <h5 className="text-base font-semibold sm:text-xl">
                      {new Date(transaction.date).toLocaleDateString("tr-TR")}
                    </h5>
                  </div>
                  <div className="w-[150px]">
                    <div className="to-primary text-base font-semibold capitalize sm:text-lg">
                      {transaction.type}
                    </div>
                    <h6 className="text-lg font-bold">
                      {transaction.amount.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="rounded-full border border-border p-2">
                    {transaction.type === "expense" ? (
                      <ArrowUpIcon className="h-[2.2rem] w-[2.2rem]" />
                    ) : transaction.type === "income" ? (
                      <ArrowDownIcon className="h-[2.2rem] w-[2.2rem]" />
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
    </>
  );
};
