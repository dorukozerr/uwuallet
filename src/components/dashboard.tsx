"use client";

import { useState } from "react";
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
            <div className="flex h-full w-full flex-col items-start justify-start">
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
                >
                  {JSON.stringify(transaction)}
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
