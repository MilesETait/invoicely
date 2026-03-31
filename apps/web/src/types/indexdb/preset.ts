export type PresetSectionType = "companyDetails" | "clientDetails" | "invoiceDetails" | "additionalInfo" | "invoiceItem";

export interface IDBPreset {
  id: string;
  sectionType: PresetSectionType;
  name: string;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}
