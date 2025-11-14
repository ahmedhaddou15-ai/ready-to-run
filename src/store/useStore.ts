import create from 'zustand';
import { Item, Template, Doc, Client, Fournisseur } from '../types';
import { localDB } from '../services/localStorageService';

interface AppState {
  items: Item[];
  templates: Template[];
  documents: Doc[];
  clients: Client[];
  fournisseurs: Fournisseur[];
  load: () => void;
  saveAll: () => void;
  addItem: (i: Item) => void;
  addTemplate: (t: Template) => void;
  addDocument: (d: Doc) => void;
}

export const useStore = create<AppState>((set, get) => ({
  items: [],
  templates: [],
  documents: [],
  clients: [],
  fournisseurs: [],
  load() {
    set({
      items: localDB.get('items', []),
      templates: localDB.get('templates', []),
      documents: localDB.get('documents', []),
      clients: localDB.get('clients', []),
      fournisseurs: localDB.get('fournisseurs', [])
    });
  },
  saveAll() {
    const { items, templates, documents, clients, fournisseurs } = get();
    localDB.set('items', items);
    localDB.set('templates', templates);
    localDB.set('documents', documents);
    localDB.set('clients', clients);
    localDB.set('fournisseurs', fournisseurs);
  },
  addItem(i) {
    const items = [...get().items, i];
    set({ items });
    localDB.set('items', items);
  },
  addTemplate(t) {
    const templates = [...get().templates, t];
    set({ templates });
    localDB.set('templates', templates);
  },
  addDocument(d) {
    const documents = [...get().documents, d];
    set({ documents });
    localDB.set('documents', documents);
  }
}));