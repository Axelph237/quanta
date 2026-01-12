import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quanta | Lessons",
  description: "For The Curious",
};

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
