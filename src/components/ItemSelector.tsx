import React, { useState, useMemo } from "react";
import { Item, DocumentItem } from "../types";
import { Storage } from "../services/storage";
import { makeId } from "../utils/numbering";

type Props = {
  onAdd: (docItem: DocumentItem) => void;
  filterSupplierId?: string | null;
};

export const ItemSelector: React.FC<Props> = ({ onAdd, filterSupplierId = null }) => {
  const items = Storage.getItems();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(
    () =>
      items.filter((it) => {
        if (filterSupplierId && it.supplier_id !== filterSupplierId) return false;
        return (
          it.name.toLowerCase().includes(query.toLowerCase()) ||
          (it.description || "").toLowerCase().includes(query.toLowerCase())
        );
      }),
    [items, query, filterSupplierId]
  );

  function addSelected(quantity = 1) {
    if (!selected) return;
    const docItem: DocumentItem = {
      item_id: selected.id,
      name: selected.name,
      description: selected.description,
      quantity,
      unit: selected.unit,
      price_ht: selected.price_ht,
      tva: selected.tva ?? null,
    };
    onAdd(docItem);
    setSelected(null);
    setQuery("");
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8 }}>
        <input
          placeholder="Search item by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div style={{ maxHeight: 160, overflow: "auto", marginBottom: 8 }}>
        {filtered.map((it) => (
          <div
            key={it.id}
            onClick={() => setSelected(it)}
            style={{
              padding: 8,
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: selected?.id === it.id ? "#f0f8ff" : "transparent",
            }}
          >
            <div style={{ fontWeight: 600 }}>{it.name}</div>
            <div style={{ fontSize: 12, color: "#555" }}>
              {it.description} — HT: {it.price_ht}€ — TVA: {(it.tva ?? 0.2) * 100}%
            </div>
            <div style={{ fontSize: 12, color: it.stock_quantity && it.stock_quantity < 5 ? "crimson" : "#666" }}>
              Stock: {it.stock_quantity ?? "—"}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: "#999" }}>No items</div>}
      </div>

      {selected && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: 8 }}>
          <div style={{ fontWeight: 700 }}>{selected.name}</div>
          <div style={{ marginTop: 6 }}>
            <label>Quantity</label>
            <input
              type="number"
              defaultValue={1}
              min={1}
              id="qty"
              style={{ width: 80, marginLeft: 8 }}
            />
            <button
              style={{ marginLeft: 12 }}
              onClick={() => {
                const qtyInput = document.getElementById("qty") as HTMLInputElement;
                const qty = Math.max(1, Number(qtyInput?.value || 1));
                addSelected(qty);
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => {
            // Quick add a blank/custom item
            const custom: DocumentItem = {
              item_id: makeId("custom"),
              name: prompt("Item name") || "Item",
              quantity: Number(prompt("Quantity") || "1"),
              price_ht: Number(prompt("Price HT") || "0"),
              tva: Number(prompt("TVA rate (decimal). e.g. 0.2 for 20%") || "0.2"),
            };
            if (custom.name) onAdd(custom);
          }}
        >
          Add custom item
        </button>
      </div>
    </div>
  );
};