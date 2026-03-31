import { IDB_NAME, IDB_VERSION, IDB_SCHEMA_INVOICES, IDB_IMAGES, IDB_PRESETS } from "@/constants/indexed-db";
import { IndexedDBSchema } from "@/types/indexdb";
import { openDB } from "idb";

// Initialize the indexedDB
// This is used to create the object stores when user first opens the app
export const initIndexedDB = async () => {
  return await openDB<IndexedDBSchema>(IDB_NAME, IDB_VERSION, {
    upgrade(db, oldVersion) {
      // v1: Create invoices and images object stores
      if (oldVersion < 1) {
        const invoicesStore = db.createObjectStore(IDB_SCHEMA_INVOICES, { keyPath: "id" });
        invoicesStore.createIndex("id", "id", { unique: true });

        const imagesStore = db.createObjectStore(IDB_IMAGES, { keyPath: "id" });
        imagesStore.createIndex("id", "id", { unique: true });
      }

      // v2: Create presets object store
      if (oldVersion < 2) {
        const presetsStore = db.createObjectStore(IDB_PRESETS, { keyPath: "id" });
        presetsStore.createIndex("id", "id", { unique: true });
        presetsStore.createIndex("sectionType", "sectionType", { unique: false });
      }
    },
  });
};
