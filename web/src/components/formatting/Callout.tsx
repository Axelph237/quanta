interface CalloutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export default function Callout({ children, title, icon }: CalloutProps) {
  return (
    <div className="px-6 pt-4 m-2 border-2 border-primary rounded-xl bg-gradient-to-b from-primary/5 to-primary/80">
      <div className="flex items-center">
        <span className="mr-2">{icon}</span>
        <b className="text-xl">{title}</b>
      </div>
      <span>{children}</span>
    </div>
  );
}
