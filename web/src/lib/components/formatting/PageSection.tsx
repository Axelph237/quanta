import { ComponentProps } from "react";

export default function PageSection({
  children,
  ...params
}: ComponentProps<"div">) {
  return (
    <div className={"w-full h-[100vh] " + params.className} {...params}>
      {children}
    </div>
  );
}
