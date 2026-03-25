import { motion, HTMLMotionProps } from "framer-motion";

interface DraggableProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function Draggable({ children, ...props }: DraggableProps) {
  return (
    <motion.div
      {...props}
      drag={props.drag ?? true}
      className={`absolute cursor-grab active:cursor-grabbing ${props.className}`}
    >
      {children}
    </motion.div>
  );
}
