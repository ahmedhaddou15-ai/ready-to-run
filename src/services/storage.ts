import { Item, Template, DocumentData, Client, Fournisseur } from "../types";

const STORAGE_PREFIX = "r2r_v1";

function key(k: string) {
  return `${STORAGE_PREFIX}:${k}`;
}

function read<T>(k: string, defaultValue: T): T {
  const raw = localStorage.getItem(key(k));
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn("Failed to parse storage key", k, err);
    return defaultValue;
  }
}

function write<T>(k: string, value: T) {
  localStorage.setItem(key(k), JSON.stringify(value));
}

export const Storage = {
  getItems(): Item[] {
    return read<Item[]>("items", []);
  },
  saveItems(items: Item[]) {
    write("items", items);
  },
  getTemplates(): Template[] {
    return read<Template[]>("templates", []);
  },
  saveTemplates(templates: Template[]) {
    write("templates", templates);
  },
  getDocuments(): DocumentData[] {
    return read<DocumentData[]>("documents", []);
  },
  saveDocuments(docs: DocumentData[]) {
    write("documents", docs);
  },
  getClients(): Client[] {
    return read<Client[]>("clients", []);
  },
  saveClients(list: Client[]) {
    write("clients", list);
  },
  getFournisseurs(): Fournisseur[] {
    return read<Fournisseur[]>("fournisseurs", []);
  },
  saveFournisseurs(list: Fournisseur[]) {
    write("fournisseurs", list);
  },

  // numbering state persisted: { [typeCode]: { [year]: number } }
  getNumberingState() {
    return read<Record<string, Record<string, number>>>("numbering", {});
  },
  saveNumberingState(state: Record<string, Record<string, number>>) {
    write("numbering", state);
  },
};