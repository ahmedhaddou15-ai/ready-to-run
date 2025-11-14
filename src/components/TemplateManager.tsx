import React, { useEffect, useState } from 'react';
import { Template } from '../types';
import { useStore } from '../store/useStore';
import { v4 as uuid } from 'uuid';

export const TemplateManager: React.FC = () => {
  const templates = useStore(s => s.templates);
  const addTemplate = useStore(s => s.addTemplate);
  const [t, setT] = useState<Partial<Template>>({});

  useEffect(() => {
    if (!templates.length) {
      // ensure a default template exists
      const defaults = localStorage.getItem('docgen:templates');
      if (!defaults) {
        const dt: Template = {
          id: uuid(),
          type: 'devis',
          name: 'Default Devis',
          header: '{{company_name}}',
          footer: 'Merci pour votre confiance',
          content: 'Document {{document_number}} for {{client_name}} — total: {{total_ttc}}',
          is_default: true,
          company_info: {},
          version: 1
        };
        addTemplate(dt);
      }
    }
  }, []);

  function save() {
    const newT: Template = {
      id: uuid(),
      type: (t.type as any) || 'devis',
      name: t.name || 'Untitled',
      content: t.content || '',
      header: t.header || '',
      footer: t.footer || '',
      styles: t.styles,
      is_default: !!t.is_default,
      company_info: t.company_info || {},
      version: (t.version || 1)
    };
    addTemplate(newT);
    setT({});
  }

  return (
    <div>
      <h3>Templates</h3>
      <ul>
        {templates.map(tp => (
          <li key={tp.id}>
            <strong>{tp.name}</strong> [{tp.type}] {tp.is_default ? '(default)' : ''}
            <div>{tp.content}</div>
          </li>
        ))}
      </ul>

      <h4>Create/Edit Template</h4>
      <input placeholder="Name" value={t.name || ''} onChange={e => setT({...t, name: e.target.value})} />
      <select value={(t.type as string) || 'devis'} onChange={e => setT({...t, type: e.target.value as any})}>
        <option value="devis">devis</option>
        <option value="bon_de_commande">bon_de_commande</option>
        <option value="facture">facture</option>
        <option value="bon_de_livraison">bon_de_livraison</option>
      </select>
      <textarea placeholder="Content" value={t.content || ''} onChange={e => setT({...t, content: e.target.value})} />
      <input type="checkbox" checked={!!t.is_default} onChange={e => setT({...t, is_default: e.target.checked})} /> Default
      <button onClick={save}>Save Template</button>

      <h4>Live Preview</h4>
      <div style={{ border: '1px solid #ccc', padding: 8 }}>
        <div>{(t.header) || 'Header preview'}</div>
        <div style={{ margin: '12px 0' }}>{(t.content) || 'Body preview — use placeholders like {{document_number}}, {{client_name}}, {{total_ttc}}'}</div>
        <div>{(t.footer) || 'Footer preview'}</div>
      </div>
    </div>
  );
};