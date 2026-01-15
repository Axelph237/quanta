interface CalloutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export default function Callout({ children, title, icon }: CalloutProps) {
  return (
    <div className="px-6 py-4 m-4 border-2 border-primary rounded-xl bg-primary/10 text-on-surface">
      <div className="flex items-center mt-2 text-primary">
        {icon && <span className="mr-2">{icon}</span>}
        <b className="text-xl">{title}</b>
      </div>
      <span>{children}</span>
    </div>
  );
}
