import { motion } from "motion/react";
import { Skeleton } from "./ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      className="rounded-[24px] overflow-hidden bg-surface-0 border border-border-subtle shadow-lg"
    >
      <div className="relative h-[220px] w-full overflow-hidden bg-surface-2">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-5 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </motion.div>
  );
}
