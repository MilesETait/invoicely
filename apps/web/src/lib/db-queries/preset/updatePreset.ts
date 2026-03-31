import { db, schema } from "@invoicely/db";
import { and, eq } from "drizzle-orm";

export const updatePresetQuery = async (
  presetId: string,
  userId: string,
  updates: { name?: string; data?: unknown },
) => {
  const [updated] = await db
    .update(schema.presets)
    .set({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.data !== undefined && { data: updates.data }),
      updatedAt: new Date(),
    })
    .where(and(eq(schema.presets.id, presetId), eq(schema.presets.userId, userId)))
    .returning({ id: schema.presets.id });

  if (!updated) {
    throw new Error("Preset not found or user does not have permission to update it.");
  }

  return updated;
};
