import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, TopNavigation } from "@/components/layout";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LangChain Integration Demo",
  description:
    "A comprehensive demo showcasing LangChain, LangSmith, and LangGraph implementations with chatbot and meal planning features",
  keywords: [
    "LangChain",
    "LangSmith",
    "LangGraph",
    "AI",
    "Chatbot",
    "Meal Planning",
  ],
  authors: [{ name: "Muhamad Risman" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <TopNavigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
