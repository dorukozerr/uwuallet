import { checkAuth } from "@/actions/auth";
import { ThemeToggler } from "@/components/theme-toggler";
import { LogoutButton } from "./logout-button";

export const Header = async () => {
  const isAuthenticated = await checkAuth();

  return (
    <header className="h-18 flex w-full items-center justify-between border-b border-border p-4">
      <h1 className="text-lg font-bold leading-tight sm:text-2xl">
        Kawai Expense Tracker
      </h1>
      <div className="flex items-center justify-center gap-4">
        {isAuthenticated.success ? <LogoutButton /> : null}
        <ThemeToggler />
      </div>
    </header>
  );
};
