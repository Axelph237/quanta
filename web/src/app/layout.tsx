import type { Metadata } from "next";
import "./globals.css"; // Ensure globals.css is imported
import "katex/dist/katex.min.css"; // KaTeX styles for math rendering
import { outfit } from "./fonts";

export const metadata: Metadata = {
  title: "Quanta",
  description: "For The Curious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className}`}>{children}</body>
    </html>
  );
}
