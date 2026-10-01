import {
  IDB_NAME,
  IDB_VERSION,
  IDB_SCHEMA_INVOICES,
  IDB_IMAGES,
  IDB_PRESETS,
  IDB_DEFAULT_DETAILS,
} from "@/constants/indexed-db";
import { IndexedDBSchema } from "@/types/indexdb";
import { openDB } from "idb";

// Initialize the indexedDB
// This is used to create the object stores when user first opens the app
//
// Every store is created by checking whether it exists rather than by gating on oldVersion: a browser
// at v2 may have the fork's presets store or upstream's default-details store, so the version number
// alone doesn't say which stores are missing.
export const initIndexedDB = async () => {
  return await openDB<IndexedDBSchema>(IDB_NAME, IDB_VERSION, {
    upgrade(db) {
      // Create invoices object store
      if (!db.objectStoreNames.contains(IDB_SCHEMA_INVOICES)) {
        const invoicesStore = db.createObjectStore(IDB_SCHEMA_INVOICES, { keyPath: "id" });
        // Create index for invoices so dont allow duplicates
        invoicesStore.createIndex("id", "id", { unique: true });
      }

      // Create images object store
      if (!db.objectStoreNames.contains(IDB_IMAGES)) {
        const imagesStore = db.createObjectStore(IDB_IMAGES, { keyPath: "id" });
        // Create index for images so dont allow duplicates
        imagesStore.createIndex("id", "id", { unique: true });
      }

      // Create presets object store
      if (!db.objectStoreNames.contains(IDB_PRESETS)) {
        const presetsStore = db.createObjectStore(IDB_PRESETS, { keyPath: "id" });
        presetsStore.createIndex("id", "id", { unique: true });
        presetsStore.createIndex("sectionType", "sectionType", { unique: false });
      }

      // Create default details object store (holds a single reusable record)
      if (!db.objectStoreNames.contains(IDB_DEFAULT_DETAILS)) {
        db.createObjectStore(IDB_DEFAULT_DETAILS, { keyPath: "id" });
      }
    },
  });
};
