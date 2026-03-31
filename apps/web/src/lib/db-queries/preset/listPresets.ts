import { db, schema } from "@invoicely/db";
import { and, eq } from "drizzle-orm";

export const listPresetsQuery = async (userId: string, sectionType?: string) => {
  const conditions = [eq(schema.presets.userId, userId)];

  if (sectionType) {
    conditions.push(
      eq(schema.presets.sectionType, sectionType as typeof schema.presetSectionTypeEnum.enumValues[number]),
    );
  }

  return await db.query.presets.findMany({
    where: and(...conditions),
    orderBy: (presets, { desc }) => [desc(presets.updatedAt)],
  });
};
