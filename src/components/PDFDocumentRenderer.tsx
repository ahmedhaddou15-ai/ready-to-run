import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { Doc, Template } from '../types';

// simple placeholder replacement
function replacePlaceholders(template: string, context: Record<string, any>) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    const k = key.trim();
    return context[k] ?? '';
  });
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 12 },
  footer: { position: 'absolute', bottom: 24, fontSize: 9 }
});

const PDFDoc: React.FC<{ doc: Doc; template?: Template }> = ({ doc, template }) => {
  const context: Record<string, any> = {
    document_number: doc.number,
    date: doc.date,
    total_ht: doc.total_ht,
    total_tva: doc.total_tva,
    total_ttc: doc.total_ttc,
    client_name: doc.client_id || '',
    fournisseur_name: doc.fournisseur_id || ''
  };
  const header = template ? replacePlaceholders(template.header || '', context) : '';
  const footer = template ? replacePlaceholders(template.footer || '', context) : '';
  const body = template ? replacePlaceholders(template.content || '', context) : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>{header}</Text>
        </View>
        <View>
          <Text>{body}</Text>
          <Text style={{ marginTop: 12 }}>Items:</Text>
          {doc.items.map((l, idx) => (
            <View key={idx} style={{ marginTop: 6 }}>
              <Text>{l.name} — {l.quantity} x {l.price_ht.toFixed(2)} HT — TVA {l.tva}% = {l.total_ttc.toFixed(2)} TTC</Text>
            </View>
          ))}
          <Text style={{ marginTop: 12 }}>Total HT: {doc.total_ht.toFixed(2)}</Text>
          <Text>Total TVA: {doc.total_tva.toFixed(2)}</Text>
          <Text>Total TTC: {doc.total_ttc.toFixed(2)}</Text>
        </View>
        <Text style={styles.footer}>{footer}</Text>
      </Page>
    </Document>
  );
};

export const PDFDocumentRenderer: React.FC<{ doc: Doc; template?: Template }> = ({ doc, template }) => {
  return (
    <div>
      <PDFDownloadLink document={<PDFDoc doc={doc} template={template} />} fileName={`${doc.number}.pdf`}>
        {({ loading }) => (loading ? 'Preparing document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};