import React from "react";
import { DocumentManager } from "./components/DocumentManager";
import { TemplateManager } from "./components/TemplateManager";
import { FournisseursManager } from "./components/FournisseursManager";

/**
 * Root app with simple navigation.
 */
export const App: React.FC = () => {
  const [view, setView] = React.useState<"documents" | "templates" | "fournisseurs">("documents");

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 18 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2>Ready-to-Run — Document Generator</h2>
        <nav>
          <button onClick={() => setView("documents")}>Documents</button>{" "}
          <button onClick={() => setView("templates")}>Templates</button>{" "}
          <button onClick={() => setView("fournisseurs")}>Fournisseurs</button>
        </nav>
      </header>
      <main>
        {view === "documents" && <DocumentManager />}
        {view === "templates" && <TemplateManager />}
        {view === "fournisseurs" && <FournisseursManager />}
      </main>
      <footer style={{ marginTop: 18, fontSize: 12, color: "#666" }}>
        Offline local storage — templates & documents stored in browser.
      </footer>
    </div>
  );
};