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

// categoryToGroup and getGroup generated with AI, not gonna lie about
// it. I couldn't figure out how to do this with TS. Anyway I'm still
// trying to rely as little as possible, also trying to understand
// every block of code I get from AI. Reduce is my weak point, I hope
// I get better at that someday. 🌸🐱
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
