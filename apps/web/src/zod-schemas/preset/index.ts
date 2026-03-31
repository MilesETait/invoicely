import {
  createInvoiceFieldKeyStringValuesSchema,
  createInvoiceFieldKeyNumberValuesSchema,
  createInvoiceItemSchema,
} from "@/zod-schemas/invoice/create-invoice";
import { z } from "zod";

// Section type enum
export const presetSectionTypeSchema = z.enum([
  "companyDetails",
  "clientDetails",
  "invoiceDetails",
  "additionalInfo",
  "invoiceItem",
]);

export type PresetSectionType = z.infer<typeof presetSectionTypeSchema>;

// Per-section data schemas
export const companyDetailsPresetDataSchema = z.object({
  name: z.string(),
  address: z.string(),
  metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
  logo: z.string().nullable().optional(),
  signature: z.string().nullable().optional(),
});

export const clientDetailsPresetDataSchema = z.object({
  name: z.string(),
  address: z.string(),
  metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
});

export const invoiceDetailsPresetDataSchema = z.object({
  theme: z.object({
    baseColor: z.string(),
    mode: z.enum(["dark", "light"]),
    template: z.enum(["default", "vercel"]).optional(),
  }),
  currency: z.string(),
  prefix: z.string(),
  paymentTerms: z.string(),
  billingDetails: z.array(createInvoiceFieldKeyNumberValuesSchema),
});

export const additionalInfoPresetDataSchema = z.object({
  notes: z.string(),
  terms: z.string(),
  paymentInformation: z.array(createInvoiceFieldKeyStringValuesSchema),
});

export const invoiceItemPresetDataSchema = createInvoiceItemSchema;

// Map from section type to its data schema (for runtime validation)
export const presetDataSchemaMap = {
  companyDetails: companyDetailsPresetDataSchema,
  clientDetails: clientDetailsPresetDataSchema,
  invoiceDetails: invoiceDetailsPresetDataSchema,
  additionalInfo: additionalInfoPresetDataSchema,
  invoiceItem: invoiceItemPresetDataSchema,
} as const;

// Inferred types for each section
export type CompanyDetailsPresetData = z.infer<typeof companyDetailsPresetDataSchema>;
export type ClientDetailsPresetData = z.infer<typeof clientDetailsPresetDataSchema>;
export type InvoiceDetailsPresetData = z.infer<typeof invoiceDetailsPresetDataSchema>;
export type AdditionalInfoPresetData = z.infer<typeof additionalInfoPresetDataSchema>;
export type InvoiceItemPresetData = z.infer<typeof invoiceItemPresetDataSchema>;

// Union type for all preset data
export type PresetData =
  | CompanyDetailsPresetData
  | ClientDetailsPresetData
  | InvoiceDetailsPresetData
  | AdditionalInfoPresetData
  | InvoiceItemPresetData;

// CRUD input schemas
export const createPresetSchema = z.object({
  sectionType: presetSectionTypeSchema,
  name: z.string().min(1, "Preset name cannot be empty").max(100, "Preset name is too long"),
  data: z.unknown(),
});

export const updatePresetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  data: z.unknown().optional(),
});

export const deletePresetSchema = z.object({
  id: z.string().uuid(),
});

export const listPresetsSchema = z.object({
  sectionType: presetSectionTypeSchema.optional(),
});
