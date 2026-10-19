export type HealthStatus = "red" | "yellow" | "green";

export type CriterionType = "positive" | "negative";

export interface Criterion {
  id: string;
  label: string;
  type: CriterionType;
}

// Reseller as returned by the API.
export interface Reseller {
  id: string;
  companyName: string;
  contactName: string;
  phone: string; // digits only
  email: string;
  checkedCriteria: string[];
  score: number; // 0–10, computed
  status: HealthStatus; // computed
  createdAt: string;
  updatedAt: string;
}
