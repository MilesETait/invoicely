"use client";

import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderContainer,
  DialogIcon,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface PresetSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  defaultName?: string;
  title?: string;
}

export function PresetSaveDialog({ open, onOpenChange, onSave, defaultName = "", title = "Save Preset" }: PresetSaveDialogProps) {
  const [name, setName] = React.useState(defaultName);

  React.useEffect(() => {
    if (open) setName(defaultName);
  }, [open, defaultName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onSave(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeaderContainer>
          <DialogIcon>
            <BookmarkIcon className="size-5" />
          </DialogIcon>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Give this preset a name so you can find it later.</DialogDescription>
          </DialogHeader>
        </DialogHeaderContainer>
        <form onSubmit={handleSubmit}>
          <DialogContentContainer>
            <div className="flex flex-col gap-2">
              <Label htmlFor="preset-name" className="text-sm font-medium">
                Preset Name
              </Label>
              <Input
                id="preset-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                maxLength={100}
                autoFocus
              />
            </div>
          </DialogContentContainer>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={name.trim().length === 0}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
