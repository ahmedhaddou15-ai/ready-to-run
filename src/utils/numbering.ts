import { localDB } from '../services/localStorageService';
import { format } from 'date-fns';

type SeqRecord = Record<string, { year: number; seq: number }>;

const KEY = 'numberingSequences';

export function generateNumber(typeCode: string) {
  // typeCode example mapping: devis -> DEV, facture -> FAC, bon_de_commande -> BC, bon_de_livraison -> BL
  const mapping: Record<string, string> = {
    devis: 'DEV',
    facture: 'FAC',
    bon_de_commande: 'BC',
    bon_de_livraison: 'BL'
  };
  const code = mapping[typeCode] ?? typeCode.toUpperCase().slice(0, 3);
  const now = new Date();
  const year = Number(format(now, 'yyyy'));
  const sequences: SeqRecord = localDB.get(KEY, {});
  const key = code;
  const current = sequences[key] ?? { year, seq: 0 };
  if (current.year !== year) {
    current.year = year;
    current.seq = 0;
  }
  current.seq += 1;
  sequences[key] = current;
  localDB.set(KEY, sequences);
  const seqStr = String(current.seq).padStart(4, '0');
  return `${code}-${year}/${seqStr}`;
}

export function manualOverrideNumber(number: string) {
  // Optionally adjust sequences to reflect override (not changing seq store here)
  return number;
}