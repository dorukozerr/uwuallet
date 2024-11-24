"use client";

import { useState, useMemo, CSSProperties } from "react";
import {
  // Bar,
  // BarChart,
  Pie,
  PieChart,
} from "recharts";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { getMetrics } from "@/actions/metrics";
import { useScreenSize } from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";
import { expenseGroups, incomeCategories } from "@/lib/constants";
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
  const [infoSecState, setInfoSecState] = useState<"overview" | "analytics">(
    "overview"
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const chartConfig = useMemo(() => {
    const groups = [...Object.keys(expenseGroups), ...incomeCategories];

    const config: Record<string, { label: string; color: string }> = {};

    groups.forEach(
      (group, index) =>
        (config[group] = {
          label: `${group.charAt(0).toUpperCase()}${group.slice(1)}`,
          color: `hsl(var(--chart-${index + 1}))`,
        })
    );

    return config;
  }, []) satisfies ChartConfig;

  const overviewPieChartData = useMemo(() => {
    const { data } = metrics;

    if (data) {
      const pieChartData: {
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
                  const matchedData = pieChartData.find(
                    (d) => d.group === entry[0]
                  );

                  if (matchedData) {
                    matchedData.totalAmount += entry[1];
                  } else {
                    pieChartData.push({
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
              const matchedData = pieChartData.find(
                (d) => d.group === entry[0]
              );

              if (matchedData) {
                matchedData.totalAmount += entry[1];
              } else {
                pieChartData.push({
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
            const matchedData = pieChartData.find((d) => d.group === entry[0]);

            if (matchedData) {
              matchedData.totalAmount += entry[1];
            } else {
              pieChartData.push({
                group: entry[0],
                totalAmount: entry[1],
                fill: `var(--color-${entry[0]})`,
              });
            }
          });
        }
      });

      return pieChartData;
    } else {
      return [];
    }
  }, [date, metrics]);

  // console.log("chartConfig =>", chartConfig);
  // console.log("overviewPieChartData =>", overviewPieChartData);

  const infoSecs = {
    overview: (
      <div className="flex h-full w-full flex-col items-start justify-start lg:flex-row">
        <div className="h-full min-w-max flex-[0.4]">
          <h1>hello</h1>
        </div>
        <div className="flex h-full w-full flex-1 flex-col items-start justify-start overflow-auto md:flex-row lg:w-auto">
          <div className="h-full w-full flex-1 overflow-auto p-2 xl:p-4">
            <ChartContainer
              config={chartConfig}
              className="h-full w-full rounded-md border border-border"
            >
              <PieChart>
                <Pie
                  data={overviewPieChartData}
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
              className="h-full w-full rounded-md border border-border"
            >
              <PieChart>
                <Pie
                  data={overviewPieChartData}
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
        </div>
      </div>
    ),
    analytics: <div className="h-full w-full">Analytics</div>,
  };

  const infoSecNavButtons = [
    { label: "Overview", key: "overview" },
    { label: "Analytics", key: "analytics" },
  ] as const;

  return (
    <div className="flex h-[800px] w-full flex-col justify-start md:h-[600px] lg:h-[500px]">
      <div className="flex h-max w-full items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {infoSecNavButtons.map(({ label, key }, buttonIndex) => (
            <Button
              key={`ìnfoSecButton-${buttonIndex}`}
              onClick={() => setInfoSecState(key)}
              size="sm"
              variant={infoSecState === key ? "secondary" : "outline"}
            >
              {label}
            </Button>
          ))}
        </div>
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
                  <span>Pick a date</span>
                )}
              </span>
              <span className="block sm:hidden">Date Filter</span>
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
      <div className="w-full flex-1">{infoSecs[infoSecState]}</div>
    </div>
  );
};
