import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton rounded-lg",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
