import { createTRPCRouter } from "@/trpc/init";
import { insertPreset } from "./insertPreset";
import { listPresets } from "./listPresets";
import { updatePreset } from "./updatePreset";
import { deletePreset } from "./deletePreset";

export const presetRouter = createTRPCRouter({
  list: listPresets,
  insert: insertPreset,
  update: updatePreset,
  delete: deletePreset,
});
