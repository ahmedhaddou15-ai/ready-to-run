import { DocumentItem } from "../types";

/**
 * Ensure item tva default 20% if null/undefined
 * rate is decimal (0.2)
 */
export function normalizeTva(rate?: number | null) {
  if (rate === null || rate === undefined) return 0.2;
  return rate;
}

/**
 * Compute totals for a list of document items.
 * Returns totals and tva breakdown per rate.
 */
export function computeTotals(items: DocumentItem[]) {
  let total_ht = 0;
  let total_tva = 0;
  let total_ttc = 0;
  const breakdown: Record<string, { base: number; tva: number }> = {};

  for (const it of items) {
    const rate = normalizeTva(it.tva);
    const qty = it.quantity || 1;
    const base = (it.price_ht || 0) * qty;
    const tva = base * rate;
    const ttc = base + tva;

    it.total_ht = round(base);
    it.total_tva = round(tva);
    it.total_ttc = round(ttc);

    total_ht += base;
    total_tva += tva;
    total_ttc += ttc;

    const key = String(Math.round(rate * 100)); // e.g., "20"
    if (!breakdown[key]) breakdown[key] = { base: 0, tva: 0 };
    breakdown[key].base += base;
    breakdown[key].tva += tva;
  }

  return {
    total_ht: round(total_ht),
    total_tva: round(total_tva),
    total_ttc: round(total_ttc),
    tva_breakdown: Object.fromEntries(
      Object.entries(breakdown).map(([k, v]) => [k, { base: round(v.base), tva: round(v.tva) }])
    ),
  };
}

function round(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}