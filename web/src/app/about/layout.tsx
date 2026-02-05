export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[100vh] self-center w-1/2 flex-col items-center justify-start text-left py-[var(--page-padding)]">
      {children}
    </main>
  );
}
