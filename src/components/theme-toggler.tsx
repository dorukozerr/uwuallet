"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export const ThemeToggler = ({ mode }: { mode: "mobile" | "desktop" }) => {
  const { setTheme } = useTheme();

  const dropdownMenuItems = [
    { label: "Light", onClick: () => setTheme("light") },
    { label: "Dark", onClick: () => setTheme("dark") },
    { label: "System", onClick: () => setTheme("system") },
  ];

  return mode === "desktop" ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownMenuItems.map(({ label, onClick }, index) => (
          <DropdownMenuItem
            key={`themeToggler-dropdownItem-${index}`}
            onClick={onClick}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : mode === "mobile" ? (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Theme</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {dropdownMenuItems.map(({ label, onClick }, index) => (
              <DropdownMenuItem
                onClick={onClick}
                key={`themToggler-dropdownItem-${index}`}
              >
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  ) : null;
};
