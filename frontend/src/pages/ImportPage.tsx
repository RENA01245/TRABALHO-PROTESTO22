import { useState } from "react";
import { api } from "../api/client";

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await api.post("/imports/protests", formData);
      setResult(data);
    } catch {
      setError("Não foi possível importar o arquivo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="page-title">
        <h1>Importar Arquivo</h1>
        <p>Formatos aceitos inicialmente: CSV, TXT e JSON. O teste principal usa CSV.</p>
      </div>
      <form className="panel form-grid" onSubmit={submit}>
        <label>
          Arquivo de protestos
          <input type="file" accept=".csv,.txt,.json" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>
        {file && <div className="file-name">Selecionado: {file.name}</div>}
        {error && <div className="alert error">{error}</div>}
        <button type="submit" disabled={!file || loading}>{loading ? "Importando..." : "Importar"}</button>
      </form>
      {result && (
        <div className="panel">
          <h2>Resumo da importação</h2>
          <div className="summary">
            <span>Total: {result.totalRows}</span>
            <span>Importados: {result.importedRows}</span>
            <span>Erros: {result.errorRows}</span>
          </div>
          {result.errors?.length > 0 && (
            <table>
              <thead><tr><th>Linha</th><th>Erro</th></tr></thead>
              <tbody>{result.errors.map((item: any) => <tr key={item.id}><td>{item.rowNumber}</td><td>{item.message}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
