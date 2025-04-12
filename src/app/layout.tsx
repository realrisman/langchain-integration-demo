import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LangChain Chatbot Demo",
  description: "A simple chatbot implementation using LangChain and OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b sticky top-0 bg-white z-10 shadow-sm">
          <div className="max-w-6xl mx-auto py-4 px-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              LangChain Demo
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link
                href="/chatbot"
                className="hover:text-blue-600 transition-colors"
              >
                Chatbot
              </Link>
              <Link
                href="/meal-planner"
                className="hover:text-blue-600 transition-colors"
              >
                Meal Planner
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
