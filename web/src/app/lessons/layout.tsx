import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Quanta | Lessons",
  description: "For The Curious",
};

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://unpkg.com/quantum-circuit@0.9.247/dist/quantum-circuit.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
