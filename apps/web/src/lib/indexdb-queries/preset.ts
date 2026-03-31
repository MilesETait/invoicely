import { IDB_PRESETS } from "@/constants/indexed-db";
import { IDBPreset, PresetSectionType } from "@/types/indexdb/preset";
import { initIndexedDB } from "@/global/indexdb";
import { v4 as uuidv4 } from "uuid";

export const insertPreset = async (
  sectionType: PresetSectionType,
  name: string,
  data: unknown,
): Promise<string> => {
  const db = await initIndexedDB();
  const id = uuidv4();

  await db.put(IDB_PRESETS, {
    id,
    sectionType,
    name,
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return id;
};

export const getAllPresets = async (): Promise<IDBPreset[]> => {
  const db = await initIndexedDB();
  return await db.getAll(IDB_PRESETS);
};

export const getPresetsBySection = async (sectionType: PresetSectionType): Promise<IDBPreset[]> => {
  const db = await initIndexedDB();
  return await db.getAllFromIndex(IDB_PRESETS, "sectionType", sectionType);
};

export const updatePreset = async (
  id: string,
  updates: { name?: string; data?: unknown },
): Promise<void> => {
  const db = await initIndexedDB();
  const existing = await db.get(IDB_PRESETS, id);

  if (!existing) {
    throw new Error("Preset not found");
  }

  await db.put(IDB_PRESETS, {
    ...existing,
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.data !== undefined && { data: updates.data }),
    updatedAt: new Date(),
  });
};

export const deletePreset = async (id: string): Promise<void> => {
  const db = await initIndexedDB();
  await db.delete(IDB_PRESETS, id);
};
