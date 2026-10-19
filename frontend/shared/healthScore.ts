import { BANDS } from "./bands.js";
import { CRITERIA } from "./criteria.js";
import type { Criterion, HealthStatus } from "./types.js";

const KNOWN_IDS = new Set(CRITERIA.map((c) => c.id));

// Drops ids of criteria that no longer exist in the configuration.
export function knownCriteria(checked: string[]): string[] {
  return checked.filter((id) => KNOWN_IDS.has(id));
}

// score = (checked positives − checked negatives) ÷ total positives × 10, clamped to 0–10.
export function calculateHealthScore(checked: string[], criteria: Criterion[] = CRITERIA) {
  const selected = new Set(checked);
  const count = (type: Criterion["type"], onlyChecked: boolean) =>
    criteria.filter((c) => c.type === type && (!onlyChecked || selected.has(c.id))).length;

  const positives = count("positive", true);
  const negatives = count("negative", true);
  const totalPositives = count("positive", false);

  const points = Math.max(0, positives - negatives);
  const score = totalPositives === 0 ? 0 : Math.min(10, Math.round((points / totalPositives) * 10));
  const band = BANDS.find((b) => score >= b.min && score <= b.max) ?? BANDS[0];
  return { score, status: band.status as HealthStatus, positives, negatives, totalPositives };
}
