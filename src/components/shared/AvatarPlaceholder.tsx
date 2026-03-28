"use client";

import { getAvatarStyle } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

interface AvatarPlaceholderProps {
  name: string;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

export default function AvatarPlaceholder({
  name,
  size = "md",
  className,
}: AvatarPlaceholderProps) {
  const { bg, initials } = getAvatarStyle(name);

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center font-semibold text-white",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {initials}
    </div>
  );
}
