import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { expenseGroups } from "@/lib/constants";

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
