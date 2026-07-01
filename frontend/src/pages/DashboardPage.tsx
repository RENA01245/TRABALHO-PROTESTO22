import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FileUp, ListChecks, ReceiptText, Scale, WalletCards, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { getMockProtests, mockDashboard } from "../api/mock";
import type { Protest } from "../types";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

type Dashboard = Record<"total" | "clientPaid" | "pendingBoletos" | "paidBoletos" | "pending" | "protested" | "canceled" | "importedToday", number>;

const metrics: Array<{ key: keyof Dashboard; title: string; description: string; tone: string; icon: typeof WalletCards }> = [
  { key: "pendingBoletos", title: "Boletos pendentes para pagamento", description: "Itens que o chefe precisa pagar", tone: "orange", icon: WalletCards },
  { key: "total", title: "Total de protestos", description: "Registros acompanhados", tone: "blue", icon: Scale },
  { key: "clientPaid", title: "Clientes que pagaram", description: "Aguardam boleto ou baixa", tone: "green", icon: CheckCircle2 },
  { key: "paidBoletos", title: "Boletos pagos", description: "Pagamentos finalizados", tone: "green", icon: ReceiptText },
  { key: "pending", title: "Protestos pendentes", description: "Casos que pedem revisao", tone: "yellow", icon: Clock3 },
  { key: "protested", title: "Protestados", description: "Titulos protestados", tone: "red", icon: AlertTriangle },
  { key: "canceled", title: "Cancelados", description: "Casos cancelados", tone: "gray", icon: XCircle },
  { key: "importedToday", title: "Importados hoje", description: "Novos registros do dia", tone: "blue", icon: FileUp }
];

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [protests, setProtests] = useState<Protest[]>([]);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data)).catch(() => setData(mockDashboard));
    api.get("/protests").then((response) => setProtests(response.data)).catch(() => setProtests(getMockProtests()));
  }, []);

  const pendingBoletos = protests.filter((item) => item.clientPaid && item.boletoRequired && !item.boletoPaid);
  const latestCases = [...protests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="eyebrow">Painel de acompanhamento</span>
          <h1>Dashboard</h1>
          <p>Resumo dos protestos, pagamentos de clientes e boletos que precisam de acao.</p>
        </div>
        <div className="hero-alert">
          <WalletCards size={24} />
          <div>
            <span>Boletos pendentes</span>
            <strong>{data?.pendingBoletos ?? pendingBoletos.length}</strong>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-grid">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div className={`metric ${metric.tone} ${index === 0 ? "highlight" : ""}`} key={metric.key}>
                <div className="metric-top">
                  <span className="metric-icon"><Icon size={20} /></span>
                  <span>{metric.title}</span>
                </div>
                <strong>{data?.[metric.key] ?? "-"}</strong>
                <small>{metric.description}</small>
              </div>
            );
          })}
        </div>

        <aside className="quick-actions panel">
          <h2>Acoes rapidas</h2>
          <Link className="action-button" to="/importar"><FileUp size={18} />Importar arquivo</Link>
          <Link className="action-button warning" to="/boletos-pendentes"><WalletCards size={18} />Ver boletos pendentes</Link>
          <Link className="action-button" to="/protestos"><ListChecks size={18} />Ver protestos</Link>
        </aside>
      </div>

      <div className="dashboard-sections">
        <section className="panel table-wrap">
          <div className="panel-header">
            <div>
              <h2>Boletos que precisam de pagamento</h2>
              <p>Casos com cliente pago e boleto ainda aberto.</p>
            </div>
            <Link className="link-button secondary" to="/boletos-pendentes">Abrir lista</Link>
          </div>
          {pendingBoletos.length === 0 ? <EmptyState message="Nenhum boleto pendente para pagamento." /> : (
            <table>
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingBoletos.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td>{item.protocol}</td>
                    <td>{item.debtor.name}</td>
                    <td>R$ {Number(item.boletoAmount ?? item.amount).toFixed(2)}</td>
                    <td>{item.boletoDueDate ? new Date(item.boletoDueDate).toLocaleDateString("pt-BR") : "-"}</td>
                    <td><Badge value={item.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel table-wrap">
          <div className="panel-header">
            <div>
              <h2>Ultimos casos atualizados</h2>
              <p>Movimentacoes recentes dos protestos.</p>
            </div>
            <Link className="link-button secondary" to="/protestos">Ver todos</Link>
          </div>
          {latestCases.length === 0 ? <EmptyState message="Nenhum caso atualizado ainda." /> : (
            <table>
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Atualizacao</th>
                </tr>
              </thead>
              <tbody>
                {latestCases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.protocol}</td>
                    <td>{item.debtor.name}</td>
                    <td><Badge value={item.protestStatus} /></td>
                    <td><Badge value={item.paymentStatus} /></td>
                    <td>{new Date(item.updatedAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </section>
  );
}
