import { z } from "zod";
import { checkAuth } from "@/actions/auth";
import { getTransactions } from "@/actions/transactions";
import { getMetrics } from "@/actions/metrics";
import { getLimits } from "@/actions/limits";
import { limitsFormSchema } from "@/lib/schemas";
import { Transaction } from "@/types";
import { AuthForm } from "@/components/auth";
import { Dashboard } from "@/components/dashboard";

const Page = async () => {
  const { success: isAuthenticated, username } = await checkAuth();

  if (!isAuthenticated || !username) {
    return <AuthForm />;
  }

  const { transactions } = await getTransactions();
  const { metrics } = await getMetrics();
  const { limits } = await getLimits();

  const pageData = {
    username,
    transactions: JSON.parse(JSON.stringify(transactions)) as Transaction[],
    metrics,
    limits: JSON.parse(JSON.stringify(limits)) as unknown as z.infer<
      typeof limitsFormSchema
    >,
  };

  return <Dashboard {...pageData} />;
};

export default Page;
