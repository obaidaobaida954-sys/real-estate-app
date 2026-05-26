import React from "react";
import { motion } from "motion/react";

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col flex-1 w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
