import { ComponentProps } from "react";

export default function PageSection({
  children,
  ...params
}: ComponentProps<"div">) {
  return (
    <div {...params} className={"w-full h-screen " + params.className}>
      {children}
    </div>
  );
}
