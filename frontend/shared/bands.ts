import type { HealthStatus } from "./types.js";

export interface Band {
  status: HealthStatus;
  label: string; // shown to users
  min: number;
  max: number;
  color: string;
  textColor: string;
  backgroundColor: string;
}

// Score bands (0–10), from worst to best.
export const BANDS: Band[] = [
  { status: "red", label: "Atenção", min: 0, max: 4, color: "#DC2626", textColor: "#B91C1C", backgroundColor: "#FEF2F2" },
  { status: "yellow", label: "Observar", min: 5, max: 7, color: "#F59E0B", textColor: "#B45309", backgroundColor: "#FFFBEB" },
  { status: "green", label: "Saudável", min: 8, max: 10, color: "#16A34A", textColor: "#15803D", backgroundColor: "#F0FDF4" },
];

export function bandForStatus(status: HealthStatus): Band {
  return BANDS.find((b) => b.status === status) ?? BANDS[0];
}
