export type DocumentType = 'devis' | 'bon_de_commande' | 'facture' | 'bon_de_livraison';

export interface Item {
  id: string;
  name: string;
  description?: string;
  price_ht: number;
  tva?: number; // percentage (e.g., 20)
  category?: string;
  unit?: string;
  supplier_id?: string;
  stock_quantity?: number;
}

export interface Template {
  id: string;
  type: DocumentType;
  name: string;
  content: string; // body with placeholders
  styles?: Record<string, any>;
  header?: string;
  footer?: string;
  is_default?: boolean;
  company_info?: any;
  logo?: string | null;
  terms_conditions?: string;
  version?: number;
}

export interface DocumentLine {
  item_id: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  price_ht: number;
  tva: number; // percent
  total_ht: number;
  total_ttc: number;
}

export interface Doc {
  id: string;
  type: DocumentType;
  number: string;
  date: string;
  client_id?: string;
  fournisseur_id?: string;
  items: DocumentLine[];
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  tva_breakdown: Array<{ tva: number; base: number; tva_amount: number }>;
  status?: string;
  notes?: string;
  template_id?: string;
  pdf_data?: string; // base64 or blob-url
}

export interface Client {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  type: 'client';
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
  type: 'fournisseur';
}