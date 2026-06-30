import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { getMockProtests } from "../api/mock";
import type { Protest } from "../types";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";

export function ProtestsPage() {
  const [items, setItems] = useState<Protest[]>([]);
  const [filters, setFilters] = useState({ protocol: "", debtor: "", document: "", status: "" });

  async function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    try {
      const { data } = await api.get("/protests", { params });
      setItems(data);
    } catch {
      setItems(getMockProtests().filter((item) =>
        (!filters.protocol || item.protocol.includes(filters.protocol)) &&
        (!filters.debtor || item.debtor.name.toLowerCase().includes(filters.debtor.toLowerCase())) &&
        (!filters.document || item.debtor.document.includes(filters.document)) &&
        (!filters.status || item.protestStatus === filters.status)
      ));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="page-title">
        <h1>Protestos</h1>
        <p>Lista de títulos importados e acompanhados pelo funcionário.</p>
      </div>
      <div className="panel filters">
        <input placeholder="Protocolo" value={filters.protocol} onChange={(e) => setFilters({ ...filters, protocol: e.target.value })} />
        <input placeholder="Cliente/devedor" value={filters.debtor} onChange={(e) => setFilters({ ...filters, debtor: e.target.value })} />
        <input placeholder="CPF/CNPJ" value={filters.document} onChange={(e) => setFilters({ ...filters, document: e.target.value })} />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Todos os status</option>
          <option value="IMPORTADO">Importado</option>
          <option value="CLIENTE_PAGOU">Cliente pagou</option>
          <option value="BOLETO_ENVIADO_AO_CHEFE">Boleto enviado ao chefe</option>
          <option value="BOLETO_PAGO">Boleto pago</option>
          <option value="PENDENTE">Pendente</option>
          <option value="PROTESTADO">Protestado</option>
        </select>
        <button type="button" onClick={load}>Filtrar</button>
      </div>
      <div className="panel table-wrap">
        {items.length === 0 ? <EmptyState message="Nenhum protesto encontrado." /> : (
          <table>
            <thead>
              <tr>
                <th>Protocolo</th><th>Título</th><th>Cliente</th><th>CPF/CNPJ</th><th>Valor</th><th>Status</th><th>Pagamento</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.protocol}</td>
                  <td>{item.titleNumber}</td>
                  <td>{item.debtor.name}</td>
                  <td>{item.debtor.document}</td>
                  <td>R$ {Number(item.amount).toFixed(2)}</td>
                  <td><Badge value={item.protestStatus} /></td>
                  <td><Badge value={item.paymentStatus} /></td>
                  <td><Link className="link-button" to={`/protestos/${item.id}`}>Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
