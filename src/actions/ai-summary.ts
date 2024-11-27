"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { getMetrics } from "@/actions/metrics";
import { checkAuth } from "@/actions/auth";
import { Transaction } from "@/types";
import { expenseGroups, incomeCategories } from "@/lib/constants";
import { getCollection } from "@/lib/mongo";

export const generateSummary = async ({
  limitsReport,
  metrics,
  transactions,
}: {
  metrics: Awaited<ReturnType<typeof getMetrics>>["metrics"];
  limitsReport: {
    date: string;
    group: string;
    amount: number;
    limit: number;
  }[];
  transactions: Transaction[];
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
      await collection.insertOne({ username, lastActivity: new Date() });
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
              text: `
              You are an expert financial analyst specializing in personal finance and expense tracking. Your task is to analyze a user's financial data from an expense tracker app and provide a comprehensive, detailed analysis along with personalized recommendations.

              First, I will provide you with the expense and income categories used in the app:

              <expense_groups>
                ${JSON.stringify(expenseGroups)}
              </expense_groups>

              <income_categories>
                ${JSON.stringify(incomeCategories)}
              </income_categories>

              Next, here is the user's transaction data and related metrics:

              <transactions>
                ${JSON.stringify(transactions)}
              </transactions>

              <metrics>
                ${JSON.stringify(metrics)}
              </metrics>

              Additionally, here is a report on instances where the user exceeded their set limits:

              <limits_report>
                ${JSON.stringify(limitsReport)}
              </limits_report>

              Using this information, conduct a thorough analysis of the user's financial behavior. Your analysis should include:

              1. An overview of the user's financial situation
              2. Detailed breakdown of income and expenses by category
              3. Identification of spending patterns and trends
              4. Analysis of adherence to budget limits
              5. Comparison of the user's financial behavior to general best practices

              Based on your analysis, provide:

              1. Specific, actionable recommendations for improving the user's financial health
              2. Praise for positive financial behaviors
              3. Constructive criticism for areas that need improvement
              4. Suggestions for setting realistic financial goals

              Format your response in a clear, user-friendly manner suitable for display in a frontend application and will be placed inside div. Your entire response will be placed inside <div> use any text method/technic you can use to beautify this message, you can use bulletlists and emojis. Structure to follow represents a semantic explaination. Add line breaks inside your response and dont use any html tags. Just a raw text with line breaks and bulletpoints. 

              Here's the structure to follow:

              <analysis>
                <overview>
                  [Overall financial situation summary]
                </overview>

                <income_analysis>
                  [Detailed income analysis]
                </income_analysis>

                <expense_analysis>
                  [Detailed expense analysis]
                </expense_analysis>

                <budget_adherence>
                  [Analysis of budget limit adherence]
                </budget_adherence>

                <recommendations>
                  [List of specific, actionable recommendations]
                </recommendations>

                <praise>
                  [Positive reinforcement for good financial behaviors]
                </praise>

                <areas_for_improvement>
                  [Constructive criticism and suggestions for improvement]
                </areas_for_improvement>

                <goal_suggestions>
                  [Suggestions for realistic financial goals]
                </goal_suggestions>
              </analysis>

              Ensure that your language is clear, concise, and easily understandable by the end-user. Avoid using technical jargon without explanation. Your analysis should be both informative and motivating, encouraging the user to make positive changes in their financial habits.
                `,
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
