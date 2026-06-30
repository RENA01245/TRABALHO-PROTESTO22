import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getMockProtests } from "../api/mock";

export function ReportPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.get("/reports/summary").then((response) => setReport(response.data)).catch(() => {
      const protests = getMockProtests();
      setReport({
        pendingBoletos: protests.filter((item) => item.clientPaid && item.boletoRequired && !item.boletoPaid).length,
        paidBoletos: protests.filter((item) => item.boletoPaid).length,
        clientPaid: protests.filter((item) => item.clientPaid).length,
        protested: protests.filter((item) => item.protestStatus === "PROTESTADO").length,
        byStatus: Object.entries(protests.reduce<Record<string, number>>((acc, item) => {
          acc[item.protestStatus] = (acc[item.protestStatus] ?? 0) + 1;
          return acc;
        }, {})).map(([protestStatus, total]) => ({ protestStatus, _count: { _all: total } }))
      });
    });
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
