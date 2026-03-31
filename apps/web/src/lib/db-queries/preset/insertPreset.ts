import { db, schema } from "@invoicely/db";
import { v4 as uuidv4 } from "uuid";

export const insertPresetQuery = async (
  userId: string,
  sectionType: string,
  name: string,
  data: unknown,
): Promise<string> => {
  const [inserted] = await db
    .insert(schema.presets)
    .values({
      id: uuidv4(),
      userId,
      sectionType: sectionType as typeof schema.presetSectionTypeEnum.enumValues[number],
      name,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.presets.id });

  if (!inserted) {
    throw new Error("Failed to insert preset into database.");
  }

  return inserted.id;
};
