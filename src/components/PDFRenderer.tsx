import React from "react";
import { Document as PdfDocument, Page, Text, View, StyleSheet, Image, Font, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { DocumentData, Template } from "../types";

/**
 * Very simple PDF renderer that uses the template header/content/footer placeholders.
 * For production you should sanitize templates and support layout/style mapping.
 */

// minimal styles
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 12 },
  footer: { marginTop: 12, fontSize: 9, color: "#666" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, marginTop: 8, paddingBottom: 6 },
  tableRow: { flexDirection: "row", marginTop: 6 },
  col: (widthPercent: number) => ({ width: `${widthPercent}%` }),
});

function renderTemplateString(tpl: string, data: Record<string, any>) {
  if (!tpl) return "";
  return tpl.replace(/\{\{(.+?)\}\}/g, (_, key) => {
    const k = key.trim();
    return data[k] !== undefined ? String(data[k]) : "";
  });
}

export const DocumentPdf: React.FC<{ doc: DocumentData; template?: Template }> = ({ doc, template }) => {
  const tpl = template || ({} as Template);
  const data = {
    document_number: doc.number,
    date: doc.date,
    total_ht: doc.total_ht,
    total_tva: doc.total_tva,
    total_ttc: doc.total_ttc,
    client_name: "", // advanced: resolve client name from storage if needed
    items: doc.items.map((it) => `${it.quantity}× ${it.name} ${it.price_ht} HT`).join("\n"),
    terms_conditions: tpl.terms_conditions || "",
    company_name: tpl.company_info?.name || "My Company",
  };

  const headerText = renderTemplateString(tpl.header || "{{company_name}}", data);
  const footerText = renderTemplateString(tpl.footer || "", data);

  return (
    <PdfDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {tpl.company_info?.logoDataUrl && <Image src={tpl.company_info.logoDataUrl} style={{ width: 100, height: 50 }} />}
          <Text>{headerText}</Text>
        </View>

        <View>
          <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>{template?.name || doc.type}</Text>
          <Text>Number: {doc.number}</Text>
          <Text>Date: {doc.date}</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.col(40)}>Description</Text>
            <Text style={styles.col(15)}>Qty</Text>
            <Text style={styles.col(15)}>PU HT</Text>
            <Text style={styles.col(15)}>TVA</Text>
            <Text style={styles.col(15)}>Total TTC</Text>
          </View>
          {doc.items.map((it, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.col(40)}>{it.name}</Text>
              <Text style={styles.col(15)}>{it.quantity}</Text>
              <Text style={styles.col(15)}>{it.price_ht.toFixed(2)}€</Text>
              <Text style={styles.col(15)}>{((it.tva ?? 0.2) * 100).toFixed(0)}%</Text>
              <Text style={styles.col(15)}>{(it.total_ttc ?? 0).toFixed(2)}€</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text>Total HT: {doc.total_ht.toFixed(2)}€</Text>
          <Text>Total TVA: {doc.total_tva.toFixed(2)}€</Text>
          <Text>Total TTC: {doc.total_ttc.toFixed(2)}€</Text>
        </View>

        <View style={styles.footer}>
          <Text>{footerText}</Text>
        </View>
      </Page>
    </PdfDocument>
  );
};

/**
 * Helper that returns a download link and an async generate function that returns a blob (useful to save in documents)
 */
export function PdfDownloadLinkAndGenerator({ doc, template }: { doc: DocumentData; template?: Template }) {
  const documentElement = <DocumentPdf doc={doc} template={template} />;
  const filename = `${doc.number}.pdf`;

  async function generateBlob(): Promise<Blob> {
    const asPdf = pdf();
    asPdf.updateContainer(documentElement);
    const blob = await asPdf.toBlob();
    return blob;
  }

  return {
    DownloadLink: <PDFDownloadLink document={documentElement} fileName={filename} key={doc.id}><button>Download PDF</button></PDFDownloadLink>,
    generateBlob,
  };
}