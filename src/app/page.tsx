import { checkAuth } from "@/actions/auth";
import { AuthenticationForm } from "@/components/authentication-form";
import { Dashboard } from "@/components/dashboard";

const Page = async () => {
  const isAuthenticated = await checkAuth();

  return isAuthenticated.success ? <Dashboard /> : <AuthenticationForm />;
};

export default Page;
