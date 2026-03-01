interface CalloutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export default function Callout({ children, title, icon }: CalloutProps) {
  return (
    <div className="px-6 py-4 m-4 border-2 border-quanta-primary rounded-xl bg-quanta-primary/10 text-quanta-on-surface">
      <div className="flex items-center mt-2 text-quanta-primary">
        {icon && <span className="mr-2">{icon}</span>}
        <b className="text-xl">{title}</b>
      </div>
      <span>{children}</span>
    </div>
  );
}
