import { checkAuth } from "@/actions/auth";
import { Transaction } from "@/types";
import { getCollection } from "@/lib/mongo";
import {
  incrementByDay,
  incrementByMonth,
  incrementByYear,
  getGroup,
} from "@/lib/utils";

// Can't describe the joy I get from coding this getMetrics action.
// My ternary operator kink exploded all around. I don't care
// if AI can generate this cleaner or shorter. This code is 100% mine
// and I'm loving it, also super proud of it. My imposter syndrome calmed
// down a bit after creating this server action anyway. 🌸🐱 I wonder
// if anyone is gonna read this someday. Greetings reader, have a great day.

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
    let chartData: {
      expenses: { [key: string]: { [key: string]: number } };
      incomes: { [key: string]: { [key: string]: number } };
    } = {
      expenses: {},
      incomes: {},
    };
    let analytics = {
      totalIncome: 0,
      totalExpense: 0,
      savingsRate: 0,
      monthlyAverages: {
        income: 0,
        expense: 0,
        balance: 0,
      },
    };

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const currDate = new Date();

      if (tx.isRecursive) {
        const finalDate = tx.endDate ? new Date(tx.endDate) : currDate;

        if (txDate > currDate) return;

        let pointer = txDate;

        while (pointer < finalDate && pointer < currDate) {
          const month = pointer.getMonth() + 1;
          const year = pointer.getFullYear();
          const dateStr = `${month.toString().length === 1 ? `0${month}` : month}-${year}`;

          const statGroup =
            tx.type === "expense"
              ? getGroup(tx.category) || "improbableCondition"
              : tx.type === "income"
                ? tx.category
                : "improbableCondition";

          const stat =
            tx.type === "expense"
              ? chartData.expenses[dateStr]
                ? chartData.expenses[dateStr][statGroup]
                  ? chartData.expenses[dateStr][statGroup]
                  : 0
                : 0
              : tx.type === "income"
                ? chartData.incomes[dateStr]
                  ? chartData.incomes[dateStr][statGroup]
                    ? chartData.incomes[dateStr][statGroup]
                    : 0
                  : 0
                : 0;

          balance =
            tx.type === "expense"
              ? balance - tx.amount
              : tx.type === "income"
                ? balance + tx.amount
                : balance;

          chartData =
            tx.type === "expense"
              ? {
                  ...chartData,
                  expenses: {
                    ...chartData.expenses,
                    [dateStr]: {
                      ...chartData.expenses[dateStr],
                      [statGroup]: stat + tx.amount,
                    },
                  },
                }
              : tx.type === "income"
                ? {
                    ...chartData,
                    incomes: {
                      ...chartData.incomes,
                      [dateStr]: {
                        ...chartData.incomes[dateStr],
                        [statGroup]: stat + tx.amount,
                      },
                    },
                  }
                : chartData;

          analytics =
            tx.type === "expense"
              ? {
                  ...analytics,
                  totalExpense: analytics.totalExpense + tx.amount,
                }
              : tx.type === "income"
                ? {
                    ...analytics,
                    totalIncome: analytics.totalIncome + tx.amount,
                  }
                : analytics;

          pointer =
            tx.recursionPeriod === "daily"
              ? incrementByDay(pointer, 1)
              : tx.recursionPeriod === "monthly"
                ? incrementByMonth(pointer, 1)
                : tx.recursionPeriod === "yearly"
                  ? incrementByYear(pointer, 1)
                  : new Date();
        }
      } else if (txDate < currDate) {
        const month = txDate.getMonth() + 1;
        const year = txDate.getFullYear();
        const dateStr = `${month.toString().length === 1 ? `0${month}` : month}-${year}`;

        const statGroup =
          tx.type === "expense"
            ? getGroup(tx.category) || "x"
            : tx.type === "income"
              ? tx.category
              : "x";

        const stat =
          tx.type === "expense"
            ? chartData.expenses[dateStr]
              ? chartData.expenses[dateStr][statGroup]
                ? chartData.expenses[dateStr][statGroup]
                : 0
              : 0
            : tx.type === "income"
              ? chartData.incomes[dateStr]
                ? chartData.incomes[dateStr][statGroup]
                  ? chartData.incomes[dateStr][statGroup]
                  : 0
                : 0
              : 0;

        balance =
          tx.type === "expense"
            ? balance - tx.amount
            : tx.type === "income"
              ? balance + tx.amount
              : balance;

        chartData =
          tx.type === "expense"
            ? {
                ...chartData,
                expenses: {
                  ...chartData.expenses,
                  [dateStr]: {
                    ...chartData.expenses[dateStr],
                    [statGroup]: stat + tx.amount,
                  },
                },
              }
            : tx.type === "income"
              ? {
                  ...chartData,
                  incomes: {
                    ...chartData.incomes,
                    [dateStr]: {
                      ...chartData.incomes[dateStr],
                      [statGroup]: stat + tx.amount,
                    },
                  },
                }
              : chartData;

        analytics =
          tx.type === "expense"
            ? {
                ...analytics,
                totalExpense: analytics.totalExpense + tx.amount,
              }
            : tx.type === "income"
              ? {
                  ...analytics,
                  totalIncome: analytics.totalIncome + tx.amount,
                }
              : analytics;
      }
    });

    const activeIncomeMonths = Object.entries(chartData.incomes).length;
    const activeExpenseMonths = Object.entries(chartData.expenses).length;

    analytics = {
      ...analytics,
      savingsRate:
        ((analytics.totalIncome - analytics.totalExpense) /
          analytics.totalIncome) *
        100,
      monthlyAverages: {
        income: analytics.totalIncome / activeIncomeMonths,
        expense: analytics.totalExpense / activeExpenseMonths,
        balance:
          (analytics.totalIncome - analytics.totalExpense) /
          Math.max(activeIncomeMonths, activeExpenseMonths),
      },
    };

    return {
      success: true,
      message: "Metrics are generated.",
      metrics: { balance, chartData, analytics },
    };
  } catch (error) {
    console.error("/metrics/getMetrics error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
