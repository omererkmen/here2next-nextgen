"use client";

import { useState } from "react";
import AvatarPlaceholder from "./AvatarPlaceholder";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: Size;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-8 min-w-8 max-w-20 p-1",
  md: "h-12 min-w-12 max-w-32 p-1.5",
  lg: "h-16 min-w-16 max-w-44 p-2",
  xl: "h-24 min-w-24 max-w-64 p-3",
};

export default function CompanyLogo({
  name,
  logoUrl,
  size = "md",
  className,
}: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return <AvatarPlaceholder name={name} size={size} className={className} />;
  }

  return (
    <div
      className={cn(
        "rounded bg-white border border-gray-200 flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={name}
        className="max-w-full max-h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
