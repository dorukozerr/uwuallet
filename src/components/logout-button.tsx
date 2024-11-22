"use client";

import { logout } from "@/actions/auth";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const LogoutButton = () => (
  <Button
    variant="outline"
    onClick={async () => {
      const res = await logout();
      toast(res.message);
    }}
  >
    Logout
  </Button>
);
