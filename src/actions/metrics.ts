import { checkAuth } from "./auth";
// import { getCollection } from "@/lib/mongo";

export const getMetrics = async () => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated || !username) {
      return { success: false, message: "Not authenticated." };
    }

    // const collection = await getCollection("transactions");
    // const transactions = await collection.find({ username }).toArray();

    // calculate balance
    // calculate chartData
    // calculate analytics

    return { success: true, message: "We're going somewhere...", metrics: {} };
  } catch (error) {
    console.error("/metrics/getBalance error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
