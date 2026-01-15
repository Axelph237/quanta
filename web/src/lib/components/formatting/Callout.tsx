interface CalloutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
}

export default function Callout({ children, title, icon }: CalloutProps) {
  return (
    <div className="px-6 pt-4 m-2 border-2 border-primary rounded-xl bg-primary-container text-on-primary-container">
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <b className="text-xl">{title}</b>
      </div>
      <span>{children}</span>
    </div>
  );
}
