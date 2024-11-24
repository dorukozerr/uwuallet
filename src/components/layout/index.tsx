import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";

export const Layout = ({ children }: { children: ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <main className="flex h-full w-full flex-col">
      <Header />
      <section className="w-full flex-1 overflow-auto">{children}</section>
      <Toaster />
    </main>
  </ThemeProvider>
);
