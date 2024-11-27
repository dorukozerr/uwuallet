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

export const limitsFormInitialValues = {
  housing: 0,
  transportation: 0,
  healthcare: 0,
  living: 0,
  family: 0,
  leisure: 0,
  financial: 0,
  miscellaneous: 0,
} as const;

export const LimitsFormDescriptions = {
  housing: expenseGroups.housing
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  transportation: expenseGroups.transportation
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  healthcare: expenseGroups.healthcare
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  living: expenseGroups.living
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  family: expenseGroups.family
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  leisure: expenseGroups.leisure
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  financial: expenseGroups.financial
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
  miscellaneous: expenseGroups.miscellaneous
    .map((type) => type.replace(/([A-Z])/g, " $1").trim())
    .join(", "),
} as const;
