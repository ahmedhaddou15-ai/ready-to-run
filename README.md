```markdown
# DocGen Modular (starter)

This repository contains a starter modular React + TypeScript app for generating company documents (devis, bon de commande, facture, bon de livraison) with:

- Item-level TVA (default 20%)
- Template-based PDF generation using @react-pdf/renderer
- Local storage persistence (templates, items, documents, clients, fournisseurs)
- Automatic numbering: TYPE-YEAR/SEQUENCE (resets yearly)
- Modular components: DocumentEditor, TemplateManager, FournisseursManager, ItemSelector, PDFDocumentRenderer

Getting started:
1. npm install
2. npm run dev

Files provided:
- src/types.ts — data types
- src/services/localStorageService.ts — simple local persistence helpers
- src/utils/tva.ts — TVA and totals utilities
- src/utils/numbering.ts — automatic numbering generator
- src/store/useStore.ts — very small zustand store wrapper
- src/components/* — modular components and PDF renderer (react-pdf)
- src/templates/defaultTemplate.json — example template

Notes:
- This is a starter; integrate into your UI framework (routing, layout, styling).
- Consider improving persistence with IndexedDB for larger datasets.
- Add tests and backups for production readiness.

If you'd like, I can now:
- Expand any component into a full page with routing and styling (Tailwind or CSS).
- Add sample data and a set of unit tests.
- Implement bulk generation and versioned templates.
```