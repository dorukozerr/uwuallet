import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <Button onClick={logout}>Logout</Button>
  </div>
);
