export const IDB_NAME = "invoicelygg";
// Bump this when schema changes. v3 reconciles two independent v2s: the fork's presets store and
// upstream's default-details store. Both bumped 1 -> 2, so a browser at v2 may hold either one.
export const IDB_VERSION = 3;

// Schema Names
export const IDB_SCHEMA_INVOICES = "inv_invoices";
export const IDB_IMAGES = "inv_images";
export const IDB_PRESETS = "inv_presets";
export const IDB_DEFAULT_DETAILS = "inv_default_details";

// Single saved record holds the user's reusable default details
export const IDB_DEFAULT_DETAILS_KEY = "default";
