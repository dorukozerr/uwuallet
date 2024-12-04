import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateRange } from "react-day-picker";
import { getMetrics } from "@/actions/metrics";
import { expenseGroups } from "@/lib/constants";
import { limitsFormSchema } from "@/lib/schemas";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const incrementByDay = (date: Date, days: number) =>
  new Date(new Date(date).setDate(date.getDate() + days));

export const incrementByMonth = (date: Date, months: number) =>
  new Date(new Date(date).setMonth(date.getMonth() + months));

export const incrementByYear = (date: Date, years: number) =>
  new Date(new Date(date).setFullYear(date.getFullYear() + years));

const categoryToGroup = Object.entries(expenseGroups).reduce(
  (acc, [group, categories]) => {
    categories.forEach((category) => {
      acc[category] = group;
    });

    return acc;
  },
  {} as Record<string, string>
);

export const getGroup = (category: string) => categoryToGroup[category] || null;

export const generatePieChartData = ({
  metrics,
  date,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  date: DateRange | undefined;
}) => {
  if (metrics) {
    const chartData: {
      group: string;
      totalAmount: number;
      fill: string;
    }[] = [];

    Object.entries(metrics.chartData.expenses).forEach(([key, value]) => {
      const expenseDateArr: (string | number)[] = key.split("-");

      expenseDateArr[0] = Number(expenseDateArr[0]) - 1;
      expenseDateArr[1] = Number(expenseDateArr[1]);

      if (date?.from || date?.to) {
        if (
          date?.from &&
          date.from < new Date(expenseDateArr[1], expenseDateArr[0])
        ) {
          if (date?.to) {
            if (date.to > new Date(expenseDateArr[1], expenseDateArr[0])) {
              Object.entries(value).map((entry) => {
                const matchedData = chartData.find((d) => d.group === entry[0]);

                if (matchedData) {
                  matchedData.totalAmount += entry[1];
                } else {
                  chartData.push({
                    group: entry[0],
                    totalAmount: entry[1],
                    fill: `var(--color-${entry[0]})`,
                  });
                }
              });

              return;
            } else {
              return;
            }
          }

          Object.entries(value).map((entry) => {
            const matchedData = chartData.find((d) => d.group === entry[0]);

            if (matchedData) {
              matchedData.totalAmount += entry[1];
            } else {
              chartData.push({
                group: entry[0],
                totalAmount: entry[1],
                fill: `var(--color-${entry[0]})`,
              });
            }
          });

          return;
        }
      } else {
        Object.entries(value).map((entry) => {
          const matchedData = chartData.find((d) => d.group === entry[0]);

          if (matchedData) {
            matchedData.totalAmount += entry[1];
          } else {
            chartData.push({
              group: entry[0],
              totalAmount: entry[1],
              fill: `var(--color-${entry[0]})`,
            });
          }
        });
      }
    });

    return chartData;
  } else {
    return [];
  }
};

export const generateAreaChartData = ({
  metrics,
  date,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  date: DateRange | undefined;
}) => {
  const sortData = (
    data: {
      date: string;
      expenses: number;
      incomes: number;
    }[]
  ) =>
    data.sort((a, b) => {
      const [monthA, yearA] = a.date.split("-").map(Number);
      const [monthB, yearB] = b.date.split("-").map(Number);

      const dateA = new Date(yearA, monthA - 1);
      const dateB = new Date(yearB, monthB - 1);

      return dateA.getTime() - dateB.getTime();
    });

  if (metrics) {
    let chartData: {
      date: string;
      expenses: number;
      incomes: number;
    }[] = [];

    Object.entries(metrics.chartData.expenses).forEach((expense) => {
      const dateStr = expense[0];
      const matchedData = chartData.find((d) => d.date === dateStr);

      const sum = Object.values(expense[1]).reduce(
        (acc, curr) => acc + curr,
        0
      );

      if (matchedData) {
        matchedData.expenses = sum;
      } else {
        chartData.push({
          date: dateStr,
          incomes: 0,
          expenses: sum,
        });
      }
    });

    Object.entries(metrics.chartData.incomes).forEach((income) => {
      const dateStr = income[0];
      const matchedData = chartData.find((d) => d.date === dateStr);

      const sum = Object.values(income[1]).reduce((acc, curr) => acc + curr, 0);

      if (matchedData) {
        matchedData.incomes = sum;
      } else {
        chartData.push({
          date: dateStr,
          incomes: sum,
          expenses: 0,
        });
      }
    });

    if (date?.from || date?.to) {
      const from = date.from;
      const to = date.to;

      if (from && !to) {
        chartData = chartData.filter(
          (data: { date: string }) =>
            from <
            new Date(
              Number(data.date.split("-")[1]),
              Number(data.date.split("-")[0])
            )
        );
      } else if (from && to) {
        chartData = chartData.filter(
          (data: { date: string }) =>
            from <
              new Date(
                Number(data.date.split("-")[1]),
                Number(data.date.split("-")[0])
              ) &&
            to >
              new Date(
                Number(data.date.split("-")[1]),
                Number(data.date.split("-")[0])
              )
        );
      }
    }

    return sortData(chartData);
  }
};

export const generateLimitsReport = ({
  metrics,
  limits,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  limits: z.infer<typeof limitsFormSchema> | null;
}) => {
  const exceededlimitsData: {
    date: string;
    group: string;
    amount: number;
    limit: number;
  }[] = [];
  let report: {
    [key: string]: {
      [key: string]: number;
    };
  } = {};

  const sortData = (
    data: {
      date: string;
      group: string;
      amount: number;
      limit: number;
    }[]
  ) =>
    data.sort((a, b) => {
      const [monthA, yearA] = a.date.split("-").map(Number);
      const [monthB, yearB] = b.date.split("-").map(Number);

      const dateA = new Date(yearA, monthA - 1);
      const dateB = new Date(yearB, monthB - 1);

      return dateA.getTime() - dateB.getTime();
    });

  Object.entries(metrics?.chartData?.expenses || {}).forEach((expense) => {
    Object.entries(expense[1]).forEach((entry) => {
      const groupName = entry[0] || "";

      report = {
        ...report,
        [expense[0]]: report[expense[0]]
          ? {
              ...report[expense[0]],
              [groupName]: report[expense[0]][groupName]
                ? report[expense[0]][groupName] + entry[1]
                : entry[1],
            }
          : {
              [groupName]: entry[1],
            },
      };
    });
  });

  Object.entries(report).forEach((entry) => {
    const date = entry[0];

    Object.entries(entry[1]).forEach((expense) => {
      const expenseLimit = limits
        ? limits[expense[0] as keyof Omit<typeof limits, "username">]
        : 0;

      if (limits && expenseLimit < expense[1] && expenseLimit > 0) {
        exceededlimitsData.push({
          date,
          group: expense[0],
          amount: expense[1],
          limit: expenseLimit,
        });
      }
    });
  });

  return sortData(exceededlimitsData);
};
