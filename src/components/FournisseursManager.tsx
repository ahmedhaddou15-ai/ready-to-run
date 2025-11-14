import React, { useState } from 'react';
import { Fournisseur } from '../types';
import { useStore } from '../store/useStore';
import { v4 as uuid } from 'uuid';

export const FournisseursManager: React.FC = () => {
  const fournisseurs = useStore(s => s.fournisseurs);
  const addF = useStore(s => s.addItem /* reuse addItem for brevity; ideally addFournisseur */);
  const [form, setForm] = useState<Partial<Fournisseur>>({});
  function save() {
    const newF: Fournisseur = {
      id: uuid(),
      name: form.name || 'Unnamed',
      address: form.address,
      email: form.email,
      phone: form.phone,
      contact_person: form.contact_person,
      payment_terms: form.payment_terms,
      delivery_terms: form.delivery_terms,
      bank_info: form.bank_info,
      type: 'fournisseur'
    };
    // store into fournisseurs array (basic direct localStorage usage would be better)
    const existing = localStorage.getItem('docgen:fournisseurs');
    const arr = existing ? JSON.parse(existing) : [];
    arr.push(newF);
    localStorage.setItem('docgen:fournisseurs', JSON.stringify(arr));
    setForm({});
    window.location.reload(); // quick refresh; replace with proper state update
  }
  return (
    <div>
      <h3>Fournisseurs</h3>
      <ul>
        {fournisseurs.map(f => (
          <li key={f.id}>{f.name} — {f.email}</li>
        ))}
      </ul>
      <h4>Add fournisseur</h4>
      <input placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
      <button onClick={save}>Save</button>
    </div>
  );
};