import { DocumentType, DocumentTypeCode } from "../types";
import { Storage } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

/**
 * Generate automatic document number in format CODE-YEAR/SEQUENCE
 * e.g. DEV-2024/0001
 * Sequence resets each year per type.
 * Accepts optional manualOverride to use provided string.
 */
export function generateDocumentNumber(type: DocumentType, manualOverride?: string) {
  if (manualOverride && manualOverride.trim().length > 0) {
    return manualOverride.trim();
  }

  const code = DocumentTypeCode[type];
  const year = new Date().getFullYear().toString();
  const state = Storage.getNumberingState();
  if (!state[code]) state[code] = {};
  if (!state[code][year]) state[code][year] = 0;
  state[code][year] = state[code][year] + 1;
  Storage.saveNumberingState(state);

  const seq = String(state[code][year]).padStart(4, "0");
  return `${code}-${year}/${seq}`;
}

// helper to reset (used for tests or admin)
export function resetNumberingForYear(type: DocumentType, year?: number) {
  const code = DocumentTypeCode[type];
  const state = Storage.getNumberingState();
  const y = (year || new Date().getFullYear()).toString();
  if (!state[code]) state[code] = {};
  state[code][y] = 0;
  Storage.saveNumberingState(state);
}

// small helper to generate ids for resources
export function makeId(prefix = "id") {
  return `${prefix}_${uuidv4()}`;
}