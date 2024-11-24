import { checkAuth } from "./auth";
import { Transaction } from "@/types";
import { getCollection } from "@/lib/mongo";
import { incrementByDay, incrementByMonth, incrementByYear } from "@/lib/utils";

export const getMetrics = async () => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated || !username) {
      return { success: false, message: "Not authenticated." };
    }

    const collection = await getCollection("transactions");
    const transactions = (await collection
      .find({ username })
      .toArray()) as unknown as Transaction[];

    let balance = 0;

    transactions.forEach(
      ({ amount, type, date, isRecursive, recursionPeriod, endDate }) => {
        const transactionDate = new Date(date);
        const currentDate = new Date();

        if (isRecursive) {
          const finalDate = endDate ? new Date(endDate) : currentDate;

          if (transactionDate > currentDate) return;

          let pointer = transactionDate;

          while (pointer < finalDate && pointer < currentDate) {
            pointer =
              recursionPeriod === "daily"
                ? incrementByDay(pointer, 1)
                : recursionPeriod === "monthly"
                  ? incrementByMonth(pointer, 1)
                  : recursionPeriod === "yearly"
                    ? incrementByYear(pointer, 1)
                    : new Date();

            balance =
              type === "expense"
                ? balance - amount
                : type === "income"
                  ? balance + amount
                  : balance;
          }
        } else if (transactionDate < currentDate) {
          balance =
            type === "expense"
              ? balance - amount
              : type === "income"
                ? balance + amount
                : balance;
        }
      }
    );

    return {
      success: true,
      message: "We're going somewhere...",
      metrics: { balance },
    };
  } catch (error) {
    console.error("/metrics/getBalance error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
