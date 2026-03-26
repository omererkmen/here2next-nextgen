export const sectors = [
  "FinTech", "HealthTech", "EdTech", "AgriTech", "EnerjiTech", "Lojistik",
  "Perakende Tech", "Siber Güvenlik", "Endüstri 4.0", "GreenTech", "Seyahat Tech"
];

export const stages = [
  { value: "pre_seed", label: { tr: "Pre-Seed", en: "Pre-Seed" } },
  { value: "seed", label: { tr: "Seed", en: "Seed" } },
  { value: "series_a", label: { tr: "Series A", en: "Series A" } },
  { value: "series_b", label: { tr: "Series B", en: "Series B" } },
  { value: "series_c_plus", label: { tr: "Series C+", en: "Series C+" } },
];

export const stageLabels: Record<string, string> = {
  pre_seed: "Pre-Seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  series_c_plus: "Series C+",
};

export const eventTypeColors: Record<string, string> = {
  summit: "bg-emerald-50 text-emerald-700",
  pitstop: "bg-blue-50 text-blue-700",
  workshop: "bg-amber-50 text-amber-700",
  webinar: "bg-purple-50 text-purple-700",
};

// Avatar placeholder colors
const colors = ["#1B4D3E", "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#0F3460", "#16213E", "#533483", "#E94560", "#0A1128"];

export function getAvatarStyle(name: string) {
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return { bg: colors[idx], initials };
}