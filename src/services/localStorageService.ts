import { v4 as uuid } from 'uuid';

const PREFIX = 'docgen:';

function key(k: string) {
  return `${PREFIX}${k}`;
}

export const localDB = {
  get<T>(k: string, fallback: T): T {
    const raw = localStorage.getItem(key(k));
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(k: string, v: T) {
    localStorage.setItem(key(k), JSON.stringify(v));
  },
  add<T extends { id?: string }>(k: string, v: T) {
    const items = localDB.get<T[]>(k, []);
    const withId = { ...v, id: v.id ?? uuid() } as T & { id: string };
    items.push(withId);
    localDB.set(k, items);
    return withId;
  },
  update<T extends { id: string }>(k: string, id: string, patch: Partial<T>) {
    const items = localDB.get<T[]>(k, []);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    localDB.set(k, items);
    return items[idx];
  },
  delete(k: string, id: string) {
    const items = localDB.get<any[]>(k, []);
    const filtered = items.filter(i => i.id !== id);
    localDB.set(k, filtered);
  }
};