"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getMetrics } from "@/actions/metrics";
import { checkAuth } from "@/actions/auth";
import { expenseGroups, incomeCategories } from "@/lib/constants";
import { getCollection } from "@/lib/mongo";

export const generateSummary = async ({
  limitsReport,
  metrics,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  limitsReport: {
    date: string;
    group: string;
    amount: number;
    limit: number;
  }[];
}) => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated) {
      return { success: false, message: "Not authorized." };
    }

    if (username !== "doruk") {
      return {
        success: false,
        message:
          "Please contact developer to activate AI summary functionality for your account.",
      };
    }

    const collection = await getCollection("ai-usages");

    const activityRecord = (await collection.findOne({ username })) as {
      lastActivity: Date;
    } | null;

    if (!activityRecord) {
      collection.insertOne({ username, lastActivity: new Date() });
    } else {
      const isOneDayPassed =
        new Date().getTime() - activityRecord.lastActivity.getTime() >=
        24 * 60 * 60 * 1000;

      if (!isOneDayPassed) {
        return {
          success: false,
          message: "You can generate only one summary per one day.",
        };
      }
    }

    const result = await generateText({
      model: anthropic("claude-3-5-sonnet-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Theese are expense and income categories: ${JSON.stringify(expenseGroups)} ${JSON.stringify(incomeCategories)}`,
            },
            {
              type: "text",
              text: "You are a expense/income analysis expert. You'll be feed with expense/income data. Based on that feeded that you will generate a recommendations and analysis. You will pinpoint every aspect of user's data and suggest advices.",
            },
            {
              type: "text",
              text: `User transactions and some data ${JSON.stringify(metrics)}`,
            },
            {
              type: "text",
              text: `Users exceededs limits data: ${JSON.stringify(limitsReport)}`,
            },

            {
              type: "text",
              text: "Generate some suggestions advices and reports based on user's data. Your response will be used in frontend so keep your resposne end user focused at all cost.",
            },
          ],
        },
      ],
    });

    await collection.findOneAndUpdate(
      { username },
      { $set: { summary: result.text } }
    );

    return {
      success: true,
      summary: result.text,
      message: "Summary generated successfully.",
    };
  } catch (error) {
    console.error("/ai-summary/generateSummary error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};

export const getSummary = async () => {
  try {
    const { success: isAuthenticated, username } = await checkAuth();

    if (!isAuthenticated) {
      return { success: false, message: "Not authorized." };
    }

    const collection = await getCollection("ai-usages");

    const activityRecord = (await collection.findOne({ username })) as {
      summary: string;
    } | null;

    if (!activityRecord) {
      return { success: false, message: "Activity record not found." };
    }

    return {
      success: true,
      message: "Activity record fetched",
      summary: activityRecord.summary,
    };
  } catch (error) {
    console.error("/au-summary/getSummary error =>", error);

    return { success: false, message: "Unknown server error." };
  }
};
