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
  }>({
    open: false,
    mode: "",
    transaction: null,
  });

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg capitalize sm:text-3xl">
            Welcome {username}!
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() =>
                setTransactionDialogState({
                  open: true,
                  mode: "create",
                  transaction: null,
                })
              }
            >
              Add Transaction
            </Button>
          </div>
        </div>
        <div>{JSON.stringify(transactions)}</div>
      </div>
      <TransactionDialog
        open={transactionDialogState.open}
        onOpenChange={() =>
          setTransactionDialogState({
            open: false,
            mode: "",
            transaction: null,
          })
        }
        mode={transactionDialogState.mode}
        transaction={transactionDialogState.transaction}
      />
    </>
  );
};
