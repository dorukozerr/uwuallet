import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const incrementByDay = (date: Date, days: number) =>
  new Date(date).setDate(date.getDate() + days);

export const incrementByMonth = (date: Date, months: number) =>
  new Date(date).setMonth(date.getMonth() + months);

export const incrementByYear = (date: Date, years: number) =>
  new Date(date).setFullYear(date.getFullYear() + years);
