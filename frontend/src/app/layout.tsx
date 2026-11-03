import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AlgoDocs-Interactive — Technical Documentation & Concept Visualizer Engine",
  description:
    "Interactive technical documentation and concept visualizer engine. Simplifies complex algorithms and data structures through topic-based writing, plain-English analogies, and interactive traces.",
  keywords: ["Technical Documentation", "Docs-as-Code", "Diataxis", "Algorithms", "DSA", "Concept Simplification", "Interactive Visualizer"],
  openGraph: {
    title: "AlgoDocs-Interactive",
    description: "Interactive Technical Documentation & Algorithm Concept Visualizer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
