import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quanta | Home",
  description: "For The Curious",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
