import { checkAuth } from "@/actions/auth";
import { getTransactions } from "@/actions/transactions";
import { getMetrics } from "@/actions/metrics";
import { Transaction } from "@/types";
import { AuthForm } from "@/components/views/auth-form";
import { Dashboard } from "@/components/views/dashboard";

const Page = async () => {
  const { success: isAuthenticated, username } = await checkAuth();

  if (!isAuthenticated || !username) {
    return <AuthForm />;
  }

  const { transactions } = await getTransactions({ username });

  const metrics = await getMetrics();

  const t = JSON.parse(JSON.stringify(transactions)) as Transaction[];

  const pageData = { username, transactions: t, metrics };

  return <Dashboard {...pageData} />;
};

export default Page;
