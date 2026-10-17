import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
  hover?: boolean;
}

function AnimatedCard({
  children,
  className = "",
  index = 0,
  hover = true,
}: AnimatedCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.95 }
      }
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={
        hover
          ? { y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;
