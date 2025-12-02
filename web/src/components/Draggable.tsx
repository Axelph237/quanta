import { motion, HTMLMotionProps } from "framer-motion";

interface DraggableProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function Draggable({ children, ...props }: DraggableProps) {
  return (
    <motion.div
      drag={props.drag ?? true}
      className={`absolute cursor-grabbing ${props.className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
