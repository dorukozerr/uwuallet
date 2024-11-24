import { ReactNode } from "react";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { Layout } from "@/components/layout";
import "./globals.css";

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description:
    "Expense tracker app, made with nextjs, ts, and mongodb.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className={rubik.className}>
      <Layout>{children}</Layout>
    </body>
  </html>
);

export default RootLayout;
