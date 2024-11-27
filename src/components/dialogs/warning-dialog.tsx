import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const WarningDialog = ({
  open,
  onOpenChange,
  exceededLimits,
}: {
  open: boolean;
  onOpenChange: () => void;
  exceededLimits: {
    date: string;
    group: string;
    amount: number;
    limit: number;
  }[];
}) => {
  const totalExcess = exceededLimits.reduce(
    (sum, item) => sum + (item.amount - item.limit),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(600px,95vh)] max-w-[min(800px,95vw)] flex-col rounded-md p-4 sm:p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle className="text-xl font-semibold">
              Spending Limit Alert
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            You&apos;ve exceeded your spending limits in {exceededLimits.length}{" "}
            {exceededLimits.length === 1 ? "category" : "categories"}, going
            over by a total of ${totalExcess.toLocaleString("tr-TR")}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full space-y-4 overflow-auto border-b border-t border-border py-4">
          {exceededLimits.map((exceededLimit, index) => {
            const excess = exceededLimit.amount - exceededLimit.limit;
            const percentageOver = (
              (excess / exceededLimit.limit) *
              100
            ).toFixed(1);

            return (
              <div
                key={`exceededLimit-${index}`}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="space-y-1">
                    <h3 className="font-medium">{exceededLimit.group}</h3>
                    <p className="text-sm">{exceededLimit.date}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <div className="text-sm font-medium">
                      ${exceededLimit.amount.toFixed(2)} / $
                      {exceededLimit.limit.toFixed(2)}
                    </div>
                    <span className="text-xs font-medium text-red-600">
                      {percentageOver}% over limit
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter className="sm:justify-between">
          <p className="hidden text-sm text-gray-500 sm:block">
            Review your spending or adjust your limits
          </p>
          <div className="flex gap-3">
            <Button onClick={onOpenChange}>Got it</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
