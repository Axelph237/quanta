import { bytesized } from "@/app/fonts";
import { HTMLMotionProps, motion } from "framer-motion";
import { SchrodingersCat } from "./Icons";

interface LogoProps extends HTMLMotionProps<"span"> {
  textVisible?: boolean;
}

export default function Logo({ textVisible, className, ...props }: LogoProps) {
  return (
    <motion.span
      {...props}
      className={`${className} relative flex flex-row items-center gap-2`}
    >
      <SchrodingersCat className="w-12 h-12" />
      <motion.h1
        initial={{ opacity: textVisible ? 1 : 0 }}
        animate={{
          opacity: textVisible ? 1 : 0,
        }}
        className={`text-[3rem] ${bytesized.className} font-bold cursor-pointer`}
      >
        quanta
      </motion.h1>
    </motion.span>
  );
}
