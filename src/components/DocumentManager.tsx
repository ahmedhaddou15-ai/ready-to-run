import React, { useEffect, useState } from "react";
import { DocumentData, DocumentItem, DocumentType, Template } from "../types";
import { Storage } from "../services/storage";
import { generateDocumentNumber, makeId } from "../utils/numbering";
import { computeTotals } from "../utils/tva";
import { ItemSelector } from "./ItemSelector";
import { TemplateManager } from "./TemplateManager";
import { DocumentPdf, PdfDownloadLinkAndGenerator } from "./PDFRenderer";

/**
 * Main Document Manager flow:
 * 1. Select type -> number auto-generated
 * 2. Select template (default or specific)
 * 3. Add items with mixed TVA
 * 4. Preview (PDF)
 * 5. Generate, Download, Save (stores pdf blob as base64)
 */
export const DocumentManager: React.FC = () => {
  const [type, setType] = useState<DocumentType>("devis");
  const [number, setNumber] = useState("");
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTplId, setSelectedTplId] = useState<string | null>(null);
  const [docSaved, setDocSaved] = useState<DocumentData | null>(null);

  useEffect(() => {
    setTemplates(Storage.getTemplates());
  }, []);

  useEffect(() => {
    // auto generate number on type change
    const auto = generateDocumentNumber(type);
    setNumber(auto);
  }, [type]);

  function addItem(i: DocumentItem) {
    setItems((s) => [...s, i]);
  }

  function removeItem(idx: number) {
    setItems((s) => s.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, patch: Partial<DocumentItem>) {
    setItems((s) => s.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  const totals = computeTotals(items);

  function previewDoc(): DocumentData {
    const doc: DocumentData = {
      id: makeId("doc"),
      type,
      number,
      date: new Date().toISOString().slice(0, 10),
      items,
      total_ht: totals.total_ht,
      total_tva: totals.total_tva,
      total_ttc: totals.total_ttc,
      tva_breakdown: totals.tva_breakdown,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return doc;
  }

  async function saveAndGeneratePdf() {
    const doc = previewDoc();
    const tpl = templates.find((t) => t.id === selectedTplId) || templates.find((t) => t.is_default && (t.type === type || t.type === "all")) || undefined;

    // render PDF and generate blob
    const { generateBlob } = PdfDownloadLinkAndGenerator({ doc, template: tpl });
    const blob = await generateBlob();
    // convert to base64 to store
    const base64 = await blobToBase64(blob);
    doc.pdf_data = base64;

    // persist document
    const docs = Storage.getDocuments();
    Storage.saveDocuments([doc, ...docs]);
    setDocSaved(doc);
    alert("Document saved with PDF.");
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        res(data);
      };
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });
  }

  return (
    <div>
      <h3>Document Manager</h3>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 420 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as DocumentType)} style={{ width: "100%" }}>
              <option value="devis">Devis</option>
              <option value="bon-de-commande">Bon de commande</option>
              <option value="facture">Facture</option>
              <option value="bon-de-livraison">Bon de livraison</option>
            </select>
          </div>

          <div>
            <label>Number (auto)</label>
            <input value={number} onChange={(e) => setNumber(e.target.value)} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: "#666" }}>Format: CODE-YEAR/SEQ e.g. DEV-2024/0001. Manual override possible.</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Template</label>
            <select value={selectedTplId || ""} onChange={(e) => setSelectedTplId(e.target.value || null)} style={{ width: "100%" }}>
              <option value="">Use default</option>
              {templates
                .filter((t) => t.type === "all" || t.type === type)
                .map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.name} {t.is_default ? "(default)" : ""}
                  </option>
                ))}
            </select>
            <div style={{ marginTop: 6 }}>
              <TemplateManager />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Items</h4>
            <ItemSelector onAdd={addItem} />
            <div style={{ marginTop: 8 }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ border: "1px solid #eee", padding: 8, marginTop: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <strong>{it.name}</strong> — {it.quantity} × {it.price_ht}€ HT — TVA: {(it.tva ?? 0.2) * 100}%
                    </div>
                    <div>
                      <button onClick={() => removeItem(idx)}>Remove</button>
                    </div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, { quantity: Number(e.target.value || 1) })}
                      style={{ width: 100, marginLeft: 8 }}
                    />
                    <label style={{ marginLeft: 12 }}>TVA rate (decimal)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={it.tva ?? 0.2}
                      onChange={(e) => updateItem(idx, { tva: Number(e.target.value) })}
                      style={{ width: 100, marginLeft: 8 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <h4>Totals</h4>
              <div>Total HT: {totals.total_ht.toFixed(2)}€</div>
              <div>Total TVA: {totals.total_tva.toFixed(2)}€</div>
              <div>Total TTC: {totals.total_ttc.toFixed(2)}€</div>
              <div style={{ marginTop: 6 }}>
                <strong>TVA Breakdown:</strong>
                <ul>
                  {Object.entries(totals.tva_breakdown).map(([rate, val]) => (
                    <li key={rate}>
                      {rate}% — Base: {val.base.toFixed(2)}€ — TVA: {val.tva.toFixed(2)}€
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button onClick={() => {
                const doc = previewDoc();
                localStorage.setItem("r2r:preview_doc", JSON.stringify(doc));
                alert("Preview data saved to localStorage (you can preview in the PDF preview area)");
              }}>Save Preview</button>{" "}
              <button onClick={async () => await saveAndGeneratePdf()}>Save & Generate PDF</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Preview</h4>
          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            {/* live preview rendered by react-pdf */}
            {(() => {
              const doc = previewDoc();
              const tpl = templates.find((t) => t.id === selectedTplId) || templates.find((t) => t.is_default && (t.type === type || t.type === "all")) || undefined;
              const { DownloadLink, generateBlob } = PdfDownloadLinkAndGenerator({ doc, template: tpl });
              return (
                <div>
                  <DocumentPdf doc={doc} template={tpl} />
                  <div style={{ marginTop: 12 }}>{DownloadLink}</div>
                </div>
              );
            })()}
          </div>

          {docSaved && (
            <div style={{ marginTop: 12 }}>
              <h4>Last saved document</h4>
              <div>Number: {docSaved.number}</div>
              <div>Date: {docSaved.date}</div>
              <div>
                <a href={docSaved.pdf_data} target="_blank" rel="noreferrer">Open saved PDF</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};