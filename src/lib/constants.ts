export const expenseCategories = [
  "rent",
  "mortgage",
  "utilities",
  "homeMaintenance",
  "transportation",
  "carMaintenance",
  "fuel",
  "medical",
  "dental",
  "insurance",
  "groceries",
  "diningOut",
  "clothing",
  "personalCare",
  "childcare",
  "education",
  "entertainment",
  "subscription",
  "hobbies",
  "taxes",
  "investment",
  "bankFees",
  "gifts",
  "petCare",
  "electronics",
] as const;

export const expenseGroups = {
  housing: ["rent", "mortgage", "utilities", "homeMaintenance"],
  transportation: ["transportation", "carMaintenance", "fuel"],
  healthcare: ["medical", "dental", "insurance"],
  living: ["groceries", "diningOut", "clothing", "personalCare"],
  family: ["childcare", "education"],
  leisure: ["entertainment", "subscription", "hobbies"],
  financial: ["taxes", "investment", "bankFees"],
  miscellaneous: ["gifts", "petCare", "electronics"],
} as const;

export const incomeCategories = [
  "salary",
  "bonus",
  "freelance",
  "gift",
] as const;

export const transactionTypes = ["expense", "income"] as const;

export enum recursionPeriods {
  daily = "daily",
  monthly = "monthly",
  yearly = "yearly",
}

export const initialTransactionData = {
  title: "",
  description: "",
  amount: 0,
  type: "",
  category: "",
  date: "",
  isRecursive: false,
  recursionPeriod: undefined,
  endDate: "",
};
