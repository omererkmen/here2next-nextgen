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

// White/light logos need a dark brand-colored tile to stay visible
const DARK_BG: { match: RegExp; color: string }[] = [
  { match: /anadolu-efes/i, color: "#012169" },
  { match: /isbank/i, color: "#00205B" },
  { match: /skymod/i, color: "#0B0B1E" },
  { match: /clerion/i, color: "#101828" },
  { match: /pivony/i, color: "#1E1B4B" },
  { match: /\/bren\./i, color: "#0D2233" },
  { match: /maxijett/i, color: "#1A1A1A" },
  { match: /numanufacturing/i, color: "#8B1050" },
  { match: /complylab/i, color: "#1C1633" },
  { match: /farmhood/i, color: "#1B4332" },
  { match: /wastelog/i, color: "#14532D" },
  { match: /robolaunch/i, color: "#0F172A" },
  { match: /cogniscope/i, color: "#0F172A" },
  { match: /lumnion/i, color: "#0B1B33" },
];

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

  const darkBg = DARK_BG.find((d) => d.match.test(logoUrl))?.color;

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center overflow-hidden",
        darkBg ? "border-transparent" : "bg-white border border-gray-200",
        sizeClasses[size],
        className
      )}
      style={darkBg ? { backgroundColor: darkBg } : undefined}
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
