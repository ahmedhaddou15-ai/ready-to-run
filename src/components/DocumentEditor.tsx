import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../store/useStore';
import { Item, DocumentLine, Doc, Template } from '../types';
import { ensureItemTva, calcLineTotals, calcDocTotals } from '../utils/tva';
import { generateNumber } from '../utils/numbering';
import { ItemSelector } from './ItemSelector';
import { PDFDocumentRenderer } from './PDFDocumentRenderer';

export const DocumentEditor: React.FC<{ type: string }> = ({ type }) => {
  const templates = useStore(s => s.templates);
  const addDoc = useStore(s => s.addDocument);
  const [lines, setLines] = useState<DocumentLine[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [docNumber, setDocNumber] = useState<string>('');
  const [date] = useState<string>(new Date().toISOString().slice(0, 10));
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    setDocNumber(generateNumber(type));
  }, [type]);

  function onAddItem(item: Item) {
    const base: DocumentLine = {
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit: item.unit || 'pcs',
      price_ht: item.price_ht,
      tva: item.tva ?? 20,
      total_ht: 0,
      total_ttc: 0
    };
    const calculated = calcLineTotals(base as DocumentLine) as any;
    setLines(prev => [...prev, calculated]);
  }

  function removeLine(index: number) {
    setLines(prev => prev.filter((_, i) => i !== index));
  }

  function save() {
    const totals = calcDocTotals(lines);
    const newDoc: Doc = {
      id: uuid(),
      type: type as any,
      number: docNumber,
      date,
      items: lines,
      total_ht: totals.total_ht,
      total_tva: totals.total_tva,
      total_ttc: totals.total_ttc,
      tva_breakdown: totals.tva_breakdown,
      template_id: selectedTemplateId,
      status: 'draft'
    };
    addDoc(newDoc);
    setDoc(newDoc);
  }

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h3>Create {type}</h3>
        <div>Number: <input value={docNumber} onChange={e => setDocNumber(e.target.value)} /></div>
        <div>Date: {date}</div>

        <div>
          <h4>Template</h4>
          <select value={selectedTemplateId || ''} onChange={e => setSelectedTemplateId(e.target.value)}>
            <option value=''>-- use default --</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
          </select>
        </div>

        <div>
          <h4>Lines</h4>
          <ItemSelector onAdd={(it) => onAddItem(it)} />
          <ul>
            {lines.map((l, idx) => (
              <li key={idx}>
                {l.name} — {l.quantity} x {l.price_ht} HT — TVA {l.tva}% — {l.total_ttc.toFixed(2)}
                <button onClick={() => removeLine(idx)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={save}>Save Document</button>
      </div>

      <div style={{ width: 420 }}>
        <h4>Preview / PDF</h4>
        {doc ? <PDFDocumentRenderer doc={doc} template={selectedTemplate} /> : <div>Create and save to preview</div>}
      </div>
    </div>
  );
};