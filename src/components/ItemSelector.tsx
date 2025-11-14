import React from 'react';
import { Item } from '../types';
import { useStore } from '../store/useStore';

export const ItemSelector: React.FC<{ onAdd: (item: Item) => void; supplierFilter?: string | null }> = ({ onAdd, supplierFilter }) => {
  const items = useStore(state => state.items);
  const filtered = supplierFilter ? items.filter(i => i.supplier_id === supplierFilter) : items;
  return (
    <div>
      <h4>Items</h4>
      <ul>
        {filtered.map(it => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            <div><strong>{it.name}</strong> — {it.description}</div>
            <div>Price HT: {it.price_ht.toFixed(2)} • TVA: {(it.tva ?? 20)}%</div>
            <div>Stock: {it.stock_quantity ?? 0}</div>
            <button onClick={() => onAdd(it)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};