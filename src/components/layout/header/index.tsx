import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { checkAuth } from "@/actions/auth";
import { ThemeToggler } from "@/components/theme/theme-toggler";
import { LogoutButton } from "@/components/layout/header/logout-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = async () => {
  const { success: isAuthenticated } = await checkAuth();

  return (
    <header className="h-18 mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-border p-4">
      <h1 className="text-lg font-bold leading-tight sm:text-2xl">
        Kawai Expense Tracker
      </h1>
      <div className="hidden items-center justify-center gap-4 sm:flex">
        {isAuthenticated ? <LogoutButton mode="desktop" /> : null}
        <ThemeToggler mode="desktop" />
      </div>
      <div className="block sm:hidden" data-testid="mobile-nav">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <ThemeToggler mode="mobile" />
            {isAuthenticated ? <LogoutButton mode="mobile" /> : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
