import { DocumentLine } from '../types';

export function ensureItemTva(item: Partial<DocumentLine>) {
  return { ...item, tva: item.tva ?? 20 };
}

export function calcLineTotals(line: DocumentLine) {
  const total_ht = +(line.price_ht * line.quantity);
  const total_tva = +(total_ht * (line.tva / 100));
  const total_ttc = +(total_ht + total_tva);
  return { ...line, total_ht, total_ttc, total_tva };
}

export function calcDocTotals(lines: DocumentLine[]) {
  const totals = lines.reduce(
    (acc, l) => {
      const total_ht = acc.total_ht + l.total_ht;
      const tva_amount = acc.total_tva + l.total_ht * (l.tva / 100);
      return { total_ht, total_tva: tva_amount };
    },
    { total_ht: 0, total_tva: 0 }
  );
  const total_ttc = +(totals.total_ht + totals.total_tva);
  const tva_breakdown = Object.values(
    lines.reduce((acc: Record<string, any>, l) => {
      const key = String(l.tva);
      acc[key] = acc[key] || { tva: l.tva, base: 0, tva_amount: 0 };
      acc[key].base += l.total_ht;
      acc[key].tva_amount += l.total_ht * (l.tva / 100);
      return acc;
    }, {})
  );
  return {
    total_ht: +totals.total_ht.toFixed(2),
    total_tva: +totals.total_tva.toFixed(2),
    total_ttc: +total_ttc.toFixed(2),
    tva_breakdown: tva_breakdown.map((b: any) => ({ ...b, tva_amount: +b.tva_amount.toFixed(2), base: +b.base.toFixed(2) }))
  };
}