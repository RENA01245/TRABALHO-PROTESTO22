import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getMockProtests, saveMockProtests } from "../api/mock";
import type { Protest } from "../types";
import { EmptyState } from "../ui/EmptyState";

export function PendingBoletosPage() {
  const [items, setItems] = useState<Protest[]>([]);

  async function load() {
    try {
      const { data } = await api.get("/boletos/pending");
      setItems(data);
    } catch {
      setItems(getMockProtests().filter((item) => item.clientPaid && item.boletoRequired && !item.boletoPaid));
    }
  }

  async function markPaid(id: string) {
    try {
      await api.post(`/protests/${id}/boleto-paid`);
    } catch {
      const updated = getMockProtests().map((item) => item.id === id ? { ...item, boletoPaid: true, protestStatus: "BOLETO_PAGO", paymentStatus: "BOLETO_PAGO" } : item);
      saveMockProtests(updated);
    }
    await load();
  }

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="page-title">
        <h1>Boletos Pendentes</h1>
        <p>Casos em que o cliente já pagou e o chefe ainda precisa pagar o boleto.</p>
      </div>
      <div className="panel table-wrap">
        {items.length === 0 ? <EmptyState message="Não há boletos pendentes para pagamento." /> : (
          <table>
            <thead><tr><th>Protocolo</th><th>Cliente</th><th>Valor do boleto</th><th>Vencimento</th><th>Ação</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.protocol}</td>
                  <td>{item.debtor.name}</td>
                  <td>R$ {Number(item.boletoAmount ?? item.amount).toFixed(2)}</td>
                  <td>{item.boletoDueDate ? new Date(item.boletoDueDate).toLocaleDateString("pt-BR") : "-"}</td>
                  <td><button type="button" onClick={() => markPaid(item.id)}>Marcar como pago</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
