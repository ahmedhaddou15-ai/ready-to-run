```markdown
# Ready-to-Run — Document Generator (React + TypeScript)

This project is a modular React application for generating company documents (Devis, Bon de commande, Facture, Bon de livraison) with supplier (fournisseurs) management and template-driven PDF export.

Core features:
- Document types: devis, bon de commande, facture, bon de livraison
- Item-specific TVA (VAT) with 20% default
- Template-driven PDF export using react-pdf/renderer
- Local storage persistence (templates, documents, items, clients, fournisseurs)
- Automatic numbering: CODE-YEAR/SEQUENCE (e.g., DEV-2024/0001) with annual reset
- Modular components: DocumentManager, TemplateManager, FournisseursManager, ItemSelector
- TVA breakdown and automatic calculations

Notes:
- PDF rendering uses react-pdf. For production customization of templates, you can extend the template engine to map template fields to styled react-pdf components.
- Documents are saved into localStorage and PDFs are stored as data URLs in the document record (key r2r_v1:documents).
- This starter includes the core flows and utilities; expand the UI/UX according to your needs.

To run:
1. Install dependencies (react, react-dom, typescript, @types/react, @types/react-dom, react-pdf/renderer, uuid)
2. Start the React dev server.

Recommended dependencies (example):
- react
- react-dom
- typescript
- @types/react
- @types/react-dom
- @react-pdf/renderer
- uuid

This repository contains modular TypeScript React components designed for offline/local usage and easy extension.
```