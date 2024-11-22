import { ReactNode } from "react";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import "./globals.css";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description:
    "Simple expense tracker application, made with nextjs, ts, and mongodb.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className={rubik.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className="mx-auto flex h-full w-full max-w-[1440px] flex-col">
          <Header />
          <section className="h-full w-full flex-1 p-4">{children}</section>
          <Toaster />
        </main>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
