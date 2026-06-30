import { useEffect, useState } from "react";
import { api } from "../api/client";

export function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.get("/reports/summary").then((response) => setReport(response.data));
  }, []);

  function exportCsv() {
    window.open(`${import.meta.env.VITE_API_URL ?? "http://localhost:3333/api"}/reports/export.csv`, "_blank");
  }

  return (
    <section>
      <div className="page-title">
        <h1>Relatório Simples</h1>
        <p>Resumo para acompanhamento e apresentação acadêmica.</p>
      </div>
      <div className="cards">
        <div className="metric"><span>Boletos pendentes</span><strong>{report?.pendingBoletos ?? "-"}</strong></div>
        <div className="metric"><span>Boletos pagos</span><strong>{report?.paidBoletos ?? "-"}</strong></div>
        <div className="metric"><span>Clientes que pagaram</span><strong>{report?.clientPaid ?? "-"}</strong></div>
        <div className="metric"><span>Protestados</span><strong>{report?.protested ?? "-"}</strong></div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Protestos por status</h2>
          <button type="button" onClick={exportCsv}>Exportar CSV</button>
        </div>
        <table>
          <thead><tr><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {report?.byStatus?.map((item: any) => (
              <tr key={item.protestStatus}>
                <td>{item.protestStatus}</td>
                <td>{item._count._all}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
