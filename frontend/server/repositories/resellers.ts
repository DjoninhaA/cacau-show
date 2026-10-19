import { and, asc, eq, isNotNull, isNull } from "drizzle-orm";
import { calculateHealthScore } from "../../shared/healthScore.js";
import type { ResellerInput } from "../../shared/resellerSchema.js";
import type { Reseller } from "../../shared/types.js";
import { db } from "../db/client.js";
import { resellers } from "../db/schema.js";

type Row = typeof resellers.$inferSelect;

// Score and status are never stored: they follow the current criteria configuration.
function toReseller(row: Row): Reseller {
  const { score, status } = calculateHealthScore(row.checkedCriteria);
  return {
    id: row.id,
    companyName: row.companyName,
    cnpj: row.cnpj,
    contactName: row.contactName,
    phone: row.phone,
    email: row.email,
    checkedCriteria: row.checkedCriteria,
    score,
    status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const active = (id: string) => and(eq(resellers.id, id), isNull(resellers.deletedAt));

export async function listResellers(): Promise<Reseller[]> {
  const rows = await db.select().from(resellers).where(isNull(resellers.deletedAt)).orderBy(asc(resellers.companyName));
  return rows.map(toReseller);
}

export async function createReseller(input: ResellerInput, userId: string): Promise<Reseller> {
  const [row] = await db
    .insert(resellers)
    .values({ ...input, createdBy: userId, updatedBy: userId })
    .returning();
  return toReseller(row);
}

export async function updateReseller(id: string, input: ResellerInput, userId: string): Promise<Reseller | null> {
  const [row] = await db
    .update(resellers)
    .set({ ...input, updatedBy: userId, updatedAt: new Date() })
    .where(active(id))
    .returning();
  return row ? toReseller(row) : null;
}

export async function deleteReseller(id: string, userId: string): Promise<boolean> {
  const rows = await db
    .update(resellers)
    .set({ deletedAt: new Date(), deletedBy: userId })
    .where(active(id))
    .returning({ id: resellers.id });
  return rows.length > 0;
}

export async function restoreReseller(id: string, userId: string): Promise<Reseller | null> {
  const [row] = await db
    .update(resellers)
    .set({ deletedAt: null, deletedBy: null, updatedBy: userId, updatedAt: new Date() })
    .where(and(eq(resellers.id, id), isNotNull(resellers.deletedAt)))
    .returning();
  return row ? toReseller(row) : null;
}
