import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  gold?: boolean;
}

export default function Card({
  className,
  hover = false,
  gold = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border",
        hover &&
          "transition-all duration-200 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 cursor-pointer",
        gold && "border-gold/20 shadow-lg shadow-gold/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
