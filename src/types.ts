export type DocumentType = "devis" | "bon-de-commande" | "facture" | "bon-de-livraison";

export const DocumentTypeCode: Record<DocumentType, string> = {
  devis: "DEV",
  "bon-de-commande": "BC",
  facture: "FAC",
  "bon-de-livraison": "BL",
};

export interface Item {
  id: string;
  name: string;
  description?: string;
  price_ht: number;
  tva?: number | null; // rate as decimal (0.2 for 20%)
  category?: string;
  unit?: string;
  supplier_id?: string;
  stock_quantity?: number;
}

export interface Template {
  id: string;
  type: DocumentType | "all";
  name: string;
  content: string; // body template with placeholders
  styles?: Record<string, any>;
  header?: string;
  footer?: string;
  is_default?: boolean;
  company_info?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    logoDataUrl?: string; // data URL for embedding
  };
  terms_conditions?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentItem {
  item_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  price_ht: number;
  tva?: number | null; // decimal
  total_ht?: number;
  total_tva?: number;
  total_ttc?: number;
}

export interface DocumentData {
  id: string;
  type: DocumentType;
  number: string;
  date: string;
  client_id?: string;
  fournisseur_id?: string;
  items: DocumentItem[];
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  tva_breakdown: Record<string, { base: number; tva: number }>;
  status?: string;
  notes?: string;
  template_id?: string;
  pdf_data?: string; // base64 pdf or blob url
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  type?: "client";
}

export interface Fournisseur {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  payment_terms?: string;
  delivery_terms?: string;
  bank_info?: string;
  type?: "fournisseur";
}