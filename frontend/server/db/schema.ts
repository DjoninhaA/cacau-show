import { sql } from "drizzle-orm";
import { char, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(), // always lowercase
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // sha256 of the cookie token
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
});

export const resellers = pgTable("resellers", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: text("company_name").notNull(),
  cnpj: char("cnpj", { length: 14 }).notNull(),
  contactName: text("contact_name").notNull(),
  phone: varchar("phone", { length: 11 }).notNull(),
  email: text("email").notNull(),
  checkedCriteria: text("checked_criteria").array().notNull().default(sql`'{}'::text[]`),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // null = active
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  deletedBy: uuid("deleted_by").references(() => users.id),
});
