"use client";

import { toast } from "sonner";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const LogoutButton = ({ mode }: { mode: "desktop" | "mobile" }) =>
  mode === "desktop" ? (
    <Button
      variant="outline"
      onClick={async () => {
        const res = await logout();
        toast(res.message);
      }}
    >
      Logout
    </Button>
  ) : mode === "mobile" ? (
    <DropdownMenuGroup>
      <DropdownMenuItem
        onClick={async () => {
          const res = await logout();
          toast(res.message);
        }}
      >
        Logout
      </DropdownMenuItem>
    </DropdownMenuGroup>
  ) : null;
