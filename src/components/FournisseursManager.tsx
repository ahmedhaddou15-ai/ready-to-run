import React, { useEffect, useState } from "react";
import { Fournisseur } from "../types";
import { Storage } from "../services/storage";
import { makeId } from "../utils/numbering";

/**
 * Fournisseurs management: list, create, edit, basic metrics.
 */
export const FournisseursManager: React.FC = () => {
  const [list, setList] = useState<Fournisseur[]>([]);
  const [editing, setEditing] = useState<Fournisseur | null>(null);

  useEffect(() => {
    setList(Storage.getFournisseurs());
  }, []);

  function persist(items: Fournisseur[]) {
    setList(items);
    Storage.saveFournisseurs(items);
  }

  function newF() {
    const f: Fournisseur = {
      id: makeId("f"),
      name: "New Fournisseur",
      contact_person: "",
      type: "fournisseur",
    };
    const l = [f, ...list];
    persist(l);
    setEditing(f);
  }

  function save(f: Fournisseur) {
    const l = list.map((x) => (x.id === f.id ? f : x));
    persist(l);
    setEditing(null);
  }

  function remove(id: string) {
    if (!confirm("Delete fournisseur?")) return;
    const l = list.filter((x) => x.id !== id);
    persist(l);
  }

  return (
    <div>
      <h3>Fournisseurs</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={newF}>New Fournisseur</button>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 360 }}>
          {list.map((f) => (
            <div key={f.id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{f.name}</strong>
                <div>
                  <button onClick={() => setEditing(f)}>Edit</button>{" "}
                  <button onClick={() => remove(f.id)}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>{f.contact_person}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{f.email}</div>
            </div>
          ))}
          {list.length === 0 && <div style={{ color: "#999" }}>No fournisseurs yet</div>}
        </div>

        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ border: "1px solid #ddd", padding: 12 }}>
              <h4>Edit: {editing.name}</h4>
              <div>
                <label>Name</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label>Contact person</label>
                <input value={editing.contact_person || ""} onChange={(e) => setEditing({ ...editing, contact_person: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label>Email</label>
                <input value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label>Phone</label>
                <input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label>Bank info</label>
                <textarea value={editing.bank_info || ""} onChange={(e) => setEditing({ ...editing, bank_info: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => save(editing)}>Save</button>{" "}
                <button onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#666" }}>Select a fournisseur to edit or create a new one.</div>
          )}
        </div>
      </div>
    </div>
  );
};