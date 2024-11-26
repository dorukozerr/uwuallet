"use client";

import { useState, useMemo, CSSProperties } from "react";
import { Bar, BarChart, Pie, PieChart, XAxis } from "recharts";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { getMetrics } from "@/actions/metrics";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { expenseGroups } from "@/lib/constants";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const InfoSection = ({
  metrics,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>;
}) => {
  const { width } = useScreenSize();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const monthlyAvgBalance =
    metrics?.data?.analytics?.monthlyAverages?.balance || 0;
  const monthlyAvgIncome =
    metrics?.data?.analytics?.monthlyAverages?.income || 0;
  const monthlyAvgExpense =
    metrics?.data?.analytics?.monthlyAverages?.expense || 0;
  const savingRate = metrics?.data?.analytics?.savingsRate || 0;
  const totalIncomes = metrics?.data?.analytics?.totalIncome || 0;
  const totalExpenses = metrics?.data?.analytics?.totalExpense || 0;

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};

    Object.keys(expenseGroups).forEach(
      (group, index) =>
        (config[group] = {
          label: `${group.charAt(0).toUpperCase()}${group.slice(1)}`,
          color: `hsl(var(--chart-${index + 1}))`,
        })
    );

    return config;
  }, []) satisfies ChartConfig;

  const pieChartData = useMemo(() => {
    const { data } = metrics;

    if (data) {
      const chartData: {
        group: string;
        totalAmount: number;
        fill: string;
      }[] = [];

      Object.entries(data.chartData.expenses).forEach(([key, value]) => {
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
                  const matchedData = chartData.find(
                    (d) => d.group === entry[0]
                  );

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
  }, [date, metrics]);

  const barChartData = useMemo(() => {
    const { data } = metrics;

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

    if (data) {
      let chartData: {
        date: string;
        expenses: number;
        incomes: number;
      }[] = [];

      Object.entries(data.chartData.expenses).forEach((expense) => {
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

      Object.entries(data.chartData.incomes).forEach((income) => {
        const dateStr = income[0];
        const matchedData = chartData.find((d) => d.date === dateStr);

        const sum = Object.values(income[1]).reduce(
          (acc, curr) => acc + curr,
          0
        );

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
  }, [date, metrics]);

  return (
    <div className="flex h-[1200px] w-full flex-col justify-start md:h-[600px] lg:h-[500px]">
      <div className="flex h-max w-full items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-2"></div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              size="sm"
              variant="outline"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:block">
                {date?.from ? (
                  date.to ? (
                    <>
                      {new Date(date.from).toLocaleDateString("tr-TR")} -{" "}
                      {new Date(date.to).toLocaleDateString("tr-TR")}
                    </>
                  ) : (
                    new Date(date.from).toLocaleDateString("tr-TR")
                  )
                ) : (
                  <span>Filter Chart Data</span>
                )}
              </span>
              <span className="block sm:hidden">Filter Chart Data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              defaultMonth={date?.from}
              initialFocus
              mode="range"
              numberOfMonths={width > 768 ? 2 : 1}
              onSelect={setDate}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex-1 overflow-auto">
        <div className="flex h-full w-full flex-col items-start justify-start lg:flex-row">
          <div className="h-full w-full flex-[0.4] p-2 xl:p-4">
            <div className="flex h-full w-full flex-col items-start justify-start gap-4 rounded-md border border-border bg-muted/50 p-4 md:flex-row lg:flex-col">
              <div className="w-max space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Current Balance
                </h3>
                <h4 className="w-max text-sm md:text-base">
                  {metrics.data?.balance.toLocaleString("tr-TR") || 0} $
                </h4>
              </div>
              <div className="w-max space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Monthly Averages
                </h3>
                <div className="flex w-full items-center justify-start gap-6 text-sm md:text-base">
                  <div className="space-y-1">
                    <h5>Income</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgIncome.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Expense</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgExpense.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Balance</h5>
                    <h6 className="text-xs sm:text-sm">
                      {monthlyAvgBalance.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Saving Rate
                </h3>
                <h4 className="text-sm md:text-base">
                  {savingRate.toLocaleString("tr-TR") || 0} %
                </h4>
              </div>
              <div className="w-full space-y-1">
                <h3 className="text-base font-bold leading-tight md:text-lg">
                  Totals
                </h3>
                <div className="flex w-full items-center justify-start gap-6 text-sm md:text-base">
                  <div className="space-y-1">
                    <h5>Incomes</h5>
                    <h6 className="text-xs sm:text-sm">
                      {totalIncomes.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                  <div className="space-y-1">
                    <h5>Expenses</h5>
                    <h6 className="text-xs sm:text-sm">
                      {totalExpenses.toLocaleString("tr-TR")} $
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-1 flex-col items-start justify-start overflow-auto md:flex-row lg:w-auto">
            <div className="h-full w-full flex-1 overflow-auto p-2 xl:p-4">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full rounded-md border border-border bg-muted/50"
              >
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="totalAmount"
                    nameKey="group"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <div className="h-max-w-max flex items-center justify-start gap-2">
                            <div
                              className="max-h-2 min-h-2 min-w-2 max-w-2 rounded-full bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as CSSProperties
                              }
                            ></div>
                            <span className="capitalize">{name}</span>
                            <span className="font-bold">
                              {value.toLocaleString("tr-TR")} $
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="group" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="h-full w-full flex-1 overflow-auto p-2 xl:p-4">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full rounded-md border border-border bg-muted/50"
              >
                <BarChart accessibilityLayer data={barChartData || []}>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <Bar dataKey="incomes" fill="#ff5733" />
                  <Bar dataKey="expenses" fill="#FFBF00" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
