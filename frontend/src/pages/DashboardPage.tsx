import { useEffect, useState } from "react";
import { api } from "../api/client";
import { mockDashboard } from "../api/mock";

type Dashboard = Record<"total" | "clientPaid" | "pendingBoletos" | "paidBoletos" | "pending" | "protested" | "canceled" | "importedToday", number>;

const labels: Array<[keyof Dashboard, string]> = [
  ["pendingBoletos", "Boletos pendentes para pagamento"],
  ["total", "Total de protestos"],
  ["clientPaid", "Clientes que pagaram"],
  ["paidBoletos", "Boletos pagos"],
  ["pending", "Protestos pendentes"],
  ["protested", "Protestados"],
  ["canceled", "Cancelados"],
  ["importedToday", "Importados hoje"]
];

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data)).catch(() => setData(mockDashboard));
  }, []);

  return (
    <section>
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Resumo dos casos que precisam de acompanhamento.</p>
      </div>
      <div className="cards">
        {labels.map(([key, label], index) => (
          <div className={`metric ${index === 0 ? "highlight" : ""}`} key={key}>
            <span>{label}</span>
            <strong>{data?.[key] ?? "-"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
