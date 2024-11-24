import { checkAuth } from "@/actions/auth";
import { getTransactions } from "@/actions/transactions";
import { getMetrics } from "@/actions/metrics";
import { Transaction } from "@/types";
import { AuthenticationForm } from "@/components/authentication-form";
import { Dashboard } from "@/components/dashboard";

const Page = async () => {
  const { success: isAuthenticated, username } = await checkAuth();

  if (!isAuthenticated || !username) {
    return <AuthenticationForm />;
  }

  const { transactions } = await getTransactions({ username });

  const {} = await getMetrics();

  const t = JSON.parse(JSON.stringify(transactions)) as Transaction[];

  return <Dashboard username={username} transactions={t} />;
};

export default Page;
