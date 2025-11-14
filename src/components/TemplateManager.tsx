import React, { useEffect, useState } from "react";
import { Template, DocumentType } from "../types";
import { Storage } from "../services/storage";
import { makeId } from "../utils/numbering";

/**
 * Simple Template Manager: list, create, edit, set default.
 * Templates are simple text with placeholders.
 */
export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);

  useEffect(() => {
    setTemplates(Storage.getTemplates());
  }, []);

  function persist(list: Template[]) {
    setTemplates(list);
    Storage.saveTemplates(list);
  }

  function createNew(type: DocumentType | "all" = "all") {
    const t: Template = {
      id: makeId("tpl"),
      type,
      name: `New template (${type})`,
      content:
        "<View><Text>{{document_number}} - {{date}}</Text><Text>Items:</Text>{{items}}</View>",
      header: "{{company_name}}",
      footer: "{{terms_conditions}}",
      styles: {},
      is_default: false,
      company_info: {},
      created_at: new Date().toISOString(),
      version: 1,
    };
    const list = [t, ...templates];
    persist(list);
    setEditing(t);
  }

  function remove(id: string) {
    if (!confirm("Delete template?")) return;
    const list = templates.filter((t) => t.id !== id);
    persist(list);
  }

  function save(t: Template) {
    const list = templates.map((x) => (x.id === t.id ? { ...t, updated_at: new Date().toISOString(), version: (t.version || 1) + 1 } : x));
    persist(list);
    setEditing(null);
  }

  function setDefault(id: string) {
    const list = templates.map((t) => ({ ...t, is_default: t.id === id }));
    persist(list);
  }

  return (
    <div>
      <h3>Template Manager</h3>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => createNew("all")}>Create global template</button>{" "}
        <button onClick={() => createNew("devis")}>Create for Devis</button>{" "}
        <button onClick={() => createNew("facture")}>Create for Facture</button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 360 }}>
          <ul>
            {templates.map((t) => (
              <li key={t.id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{t.name}</strong>
                  <div>
                    <button onClick={() => setEditing(t)}>Edit</button>{" "}
                    <button onClick={() => remove(t.id)}>Delete</button>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>{t.type}</div>
                <div style={{ marginTop: 6 }}>
                  <label>
                    <input type="checkbox" checked={!!t.is_default} onChange={() => setDefault(t.id)} /> Default
                  </label>
                </div>
              </li>
            ))}
            {templates.length === 0 && <div style={{ color: "#999" }}>No templates yet</div>}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ border: "1px solid #ddd", padding: 12 }}>
              <h4>Editing: {editing.name}</h4>
              <div>
                <label>Name</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label>Type</label>
                <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}>
                  <option value="all">All</option>
                  <option value="devis">Devis</option>
                  <option value="bon-de-commande">Bon de commande</option>
                  <option value="facture">Facture</option>
                  <option value="bon-de-livraison">Bon de livraison</option>
                </select>
              </div>
              <div>
                <label>Header</label>
                <textarea value={editing.header} onChange={(e) => setEditing({ ...editing, header: e.target.value })} style={{ width: "100%", minHeight: 60 }} />
              </div>
              <div>
                <label>Content (use placeholders like {{document_number}}, {{date}}, {{items}}, {{client_name}})</label>
                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} style={{ width: "100%", minHeight: 120 }} />
              </div>
              <div>
                <label>Footer / Terms</label>
                <textarea value={editing.footer} onChange={(e) => setEditing({ ...editing, footer: e.target.value })} style={{ width: "100%", minHeight: 80 }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => save(editing)}>Save</button>{" "}
                <button onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#666" }}>Select a template to edit. Default templates are used by Document Manager.</div>
          )}
        </div>
      </div>
    </div>
  );
};