import { db, schema } from "@invoicely/db";
import { and, eq } from "drizzle-orm";

export const deletePresetQuery = async (presetId: string, userId: string) => {
  const [deleted] = await db
    .delete(schema.presets)
    .where(and(eq(schema.presets.id, presetId), eq(schema.presets.userId, userId)))
    .returning({ id: schema.presets.id });

  if (!deleted) {
    throw new Error("Preset not found or user does not have permission to delete it.");
  }

  return deleted;
};
