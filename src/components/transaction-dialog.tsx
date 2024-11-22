"use client";

import { Transaction } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const TransactionDialog = ({
  open,
  onOpenChange,
  mode,
  transaction,
}: {
  open: boolean;
  onOpenChange: () => void;
  mode: "create" | "edit" | "";
  transaction: Transaction | null;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={() => console.log("transaction =>", transaction)}>
          {mode}
        </Button>
        <DialogClose>Close</DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
