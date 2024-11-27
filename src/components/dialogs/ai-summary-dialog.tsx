import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getMetrics } from "@/actions/metrics";
import { getSummary, generateSummary } from "@/actions/ai-summary";
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

export const AISummaryDialog = ({
  open,
  onOpenChange,
  metrics,
  limitsReport,
  transactions,
}: {
  open: boolean;
  onOpenChange: () => void;
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  limitsReport: {
    date: string;
    group: string;
    amount: number;
    limit: number;
  }[];
  transactions: Transaction[];
}) => {
  const [isPending, setIsPending] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const checkSummary = async () => {
      const res = await getSummary();

      if (res.summary) {
        setSummary(res.summary);
      }

      toast(res.message);
    };

    checkSummary();
  }, []);

  const handleGenerateSummary = async () => {
    setIsPending(true);

    const res = await generateSummary({ metrics, limitsReport, transactions });

    if (res.summary) {
      setSummary(res.summary);
    }

    toast(res.message);

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(600px,95vh)] max-w-[min(800px,95vw)] flex-col rounded-md p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <DialogTitle className="text-xl font-semibold">
              AI Financial Summary
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {!summary
              ? "Get AI-powered insights about your spending patterns and recommendations"
              : "Here's your personalized financial analysis"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-start justify-start overflow-auto py-6">
          {!summary ? (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4 text-center">
              <Sparkles
                className={`h-12 w-12 text-primary opacity-50 ${isPending ? "animate-pulse" : ""}`}
              />
              <p className="text-muted-foreground">
                {isPending
                  ? "Please wait..."
                  : "Click the button below to generate your personalized financial insights"}
              </p>
            </div>
          ) : (
            <div className="w-full space-y-4 text-sm">
              <div className="whitespace-break-spaces rounded-lg border p-4">
                {summary}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button onClick={onOpenChange} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleGenerateSummary}
            disabled={isPending}
            className="gap-2"
          >
            <Sparkles
              className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`}
            />
            <span>
              {isPending ? "Generating summary..." : "Generate Summary"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
