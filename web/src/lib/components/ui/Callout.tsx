import { COLORS } from "@/app/globals";

interface CalloutProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function Callout({
  children,
  title,
  icon,
  color = COLORS.primary.hex,
}: CalloutProps) {
  return (
    <div
      className="px-6 py-4 m-4 border-2 body-text border-quanta-primary rounded-xl text-quanta-on-surface"
      style={{
        borderColor: color,
        backgroundColor: color + "19",
      }}
    >
      <div
        className="flex items-center mt-2 text-quanta-primary"
        style={{ color }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <b>{title}</b>
      </div>
      <div className="callout-content-container max-w-full">{children}</div>
    </div>
  );
}
