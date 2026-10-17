import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedRowProps {
  children: ReactNode;
  index?: number;
}

function AnimatedRow({ children, index = 0 }: AnimatedRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: "rgba(255, 193, 7, 0.05)" }}
    >
      {children}
    </motion.tr>
  );
}

export default AnimatedRow;
