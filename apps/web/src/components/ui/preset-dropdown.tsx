"use client";

import {
  insertPreset,
  getPresetsBySection,
  deletePreset as deletePresetIDB,
  updatePreset as updatePresetIDB,
} from "@/lib/indexdb-queries/preset";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookmarkIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { PresetSaveDialog } from "@/components/ui/preset-save-dialog";
import type { PresetSectionType } from "@/types/indexdb/preset";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import * as React from "react";

interface PresetDropdownProps<T> {
  sectionType: PresetSectionType;
  onLoadPreset: (data: T) => void;
  getCurrentData: () => T;
}

interface PresetEntry {
  id: string;
  name: string;
  data: unknown;
  source: "local" | "server";
}

export function PresetDropdown<T>({ sectionType, onLoadPreset, getCurrentData }: PresetDropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [editingPreset, setEditingPreset] = React.useState<PresetEntry | null>(null);

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const trpc = useTRPC();

  const queryKey = ["presets", sectionType];

  // Fetch local presets from IndexedDB
  const { data: localPresets = [] } = useQuery({
    queryKey: [...queryKey, "local"],
    queryFn: () => getPresetsBySection(sectionType),
  });

  // Fetch server presets if authenticated
  const { data: serverPresets = [] } = useQuery({
    ...trpc.preset.list.queryOptions({ sectionType }),
    enabled: !!session?.user,
  });

  // Merge presets, local first
  const presets: PresetEntry[] = React.useMemo(() => {
    const local: PresetEntry[] = localPresets.map((p) => ({
      id: p.id,
      name: p.name,
      data: p.data,
      source: "local" as const,
    }));
    const server: PresetEntry[] = serverPresets.map((p) => ({
      id: p.id,
      name: p.name,
      data: p.data,
      source: "server" as const,
    }));
    // Deduplicate by id
    const ids = new Set(local.map((p) => p.id));
    return [...local, ...server.filter((p) => !ids.has(p.id))];
  }, [localPresets, serverPresets]);

  const invalidatePresets = () => {
    queryClient.invalidateQueries({ queryKey: [...queryKey, "local"] });
    queryClient.invalidateQueries({ queryKey: trpc.preset.list.queryKey({ sectionType }) });
  };

  const serverInsertMutation = useMutation({
    ...trpc.preset.insert.mutationOptions(),
    onSuccess: () => invalidatePresets(),
  });

  const serverDeleteMutation = useMutation({
    ...trpc.preset.delete.mutationOptions(),
    onSuccess: () => invalidatePresets(),
  });

  const serverUpdateMutation = useMutation({
    ...trpc.preset.update.mutationOptions(),
    onSuccess: () => invalidatePresets(),
  });

  // A preset lives in exactly one place: on the server when the user is signed in and has allowed
  // data sync (the same opt-in invoices and images use), otherwise in this browser's IndexedDB.
  // Writing to both would list every preset twice, since the two stores generate different ids.
  const canSaveToServer = !!session?.user?.allowedSavingData;

  const handleSave = async (name: string) => {
    const data = getCurrentData();

    if (canSaveToServer) {
      serverInsertMutation.mutate(
        { sectionType, name, data },
        {
          onSuccess: () => toast.success("Preset saved to your account"),
          onError: (error) => toast.error(error.message),
        },
      );
      return;
    }

    await insertPreset(sectionType, name, data);
    invalidatePresets();
    toast.success("Preset saved");
  };

  const handleLoad = (preset: PresetEntry) => {
    onLoadPreset(preset.data as T);
    setOpen(false);
    toast.success(`Loaded "${preset.name}"`);
  };

  // Delete and rename act on wherever the preset actually lives
  const handleDelete = async (preset: PresetEntry) => {
    if (preset.source === "local") {
      await deletePresetIDB(preset.id);
    } else {
      serverDeleteMutation.mutate({ id: preset.id });
    }
    invalidatePresets();
    toast.success("Preset deleted");
  };

  const handleEditSave = async (name: string) => {
    if (!editingPreset) return;
    if (editingPreset.source === "local") {
      await updatePresetIDB(editingPreset.id, { name });
    } else {
      serverUpdateMutation.mutate({ id: editingPreset.id, name });
    }
    invalidatePresets();
    setEditingPreset(null);
    toast.success("Preset renamed");
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-5 w-5 p-0"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BookmarkIcon className="size-3.5" />
            <span className="sr-only">Presets</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-0"
          align="start"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Command>
            <CommandInput placeholder="Search presets..." />
            <CommandList>
              <CommandEmpty>No presets found.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setSaveDialogOpen(true);
                  }}
                >
                  <PlusIcon className="size-4" />
                  <span>Save current as preset...</span>
                </CommandItem>
              </CommandGroup>
              {presets.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Saved Presets">
                    {presets.map((preset) => (
                      <CommandItem
                        key={preset.id}
                        value={preset.name}
                        onSelect={() => handleLoad(preset)}
                        className="group"
                      >
                        <BookmarkIcon className="size-3.5" />
                        <span className="flex-1 truncate">{preset.name}</span>
                        <span className="flex gap-1 opacity-0 transition-opacity group-data-[selected=true]:opacity-100">
                          <button
                            type="button"
                            className="hover:text-foreground text-muted-foreground rounded-sm p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpen(false);
                              setEditingPreset(preset);
                            }}
                          >
                            <PencilIcon className="size-3" />
                          </button>
                          <button
                            type="button"
                            className="hover:text-destructive text-muted-foreground rounded-sm p-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(preset);
                            }}
                          >
                            <TrashIcon className="size-3" />
                          </button>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <PresetSaveDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} onSave={handleSave} />

      <PresetSaveDialog
        open={!!editingPreset}
        onOpenChange={(open) => {
          if (!open) setEditingPreset(null);
        }}
        onSave={handleEditSave}
        defaultName={editingPreset?.name ?? ""}
        title="Rename Preset"
      />
    </>
  );
}
