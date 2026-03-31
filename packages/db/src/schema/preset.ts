import { pgTable, text, timestamp, uuid, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user";

// Enums
export const presetSectionTypeEnum = pgEnum("preset_section_type", [
  "companyDetails",
  "clientDetails",
  "invoiceDetails",
  "additionalInfo",
  "invoiceItem",
]);

// export enum types
export type PresetSectionType = (typeof presetSectionTypeEnum.enumValues)[number];

// Tables
export const presets = pgTable("presets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sectionType: presetSectionTypeEnum("section_type").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const presetRelations = relations(presets, ({ one }) => ({
  user: one(users, {
    fields: [presets.userId],
    references: [users.id],
  }),
}));
