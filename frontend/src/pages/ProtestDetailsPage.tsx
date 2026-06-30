import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { getMockProtests, saveMockProtests } from "../api/mock";
import type { Protest } from "../types";
import { Badge } from "../ui/Badge";

export function ProtestDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Protest | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentAmount, setPaymentAmount] = useState("");
  const [boletoDueDate, setBoletoDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [boletoAmount, setBoletoAmount] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    let data: Protest;
    try {
      const response = await api.get(`/protests/${id}`);
      data = response.data;
    } catch {
      data = getMockProtests().find((protest) => protest.id === id) ?? getMockProtests()[0];
    }
    setItem(data);
    setNotes(data.notes ?? "");
    setPaymentAmount(data.clientPaymentAmount ?? data.amount);
    setBoletoAmount(data.boletoAmount ?? data.amount);
  }

  async function markClientPaid(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.post(`/protests/${id}/client-payment`, { paymentDate, amount: Number(paymentAmount) });
    } catch {
      saveMockProtests(getMockProtests().map((protest) => protest.id === id ? { ...protest, clientPaid: true, protestStatus: "CLIENTE_PAGOU", paymentStatus: "CLIENTE_PAGOU" } : protest));
    }
    await load();
  }

  async function informBoleto(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.post(`/protests/${id}/boleto`, { boletoDueDate, boletoAmount: Number(boletoAmount) });
    } catch {
      saveMockProtests(getMockProtests().map((protest) => protest.id === id ? { ...protest, boletoRequired: true, boletoDueDate, boletoAmount, protestStatus: "BOLETO_ENVIADO_AO_CHEFE", paymentStatus: "AGUARDANDO_PAGAMENTO_DO_BOLETO" } : protest));
    }
    await load();
  }

  async function markBoletoPaid() {
    try {
      await api.post(`/protests/${id}/boleto-paid`);
    } catch {
      saveMockProtests(getMockProtests().map((protest) => protest.id === id ? { ...protest, boletoPaid: true, protestStatus: "BOLETO_PAGO", paymentStatus: "BOLETO_PAGO" } : protest));
    }
    await load();
  }

  async function saveNotes(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.post(`/protests/${id}/notes`, { notes });
    } catch {
      saveMockProtests(getMockProtests().map((protest) => protest.id === id ? { ...protest, notes } : protest));
    }
    await load();
  }

  async function uploadAttachment(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      await api.post(`/protests/${id}/attachments`, form);
    } catch {
      saveMockProtests(getMockProtests().map((protest) => protest.id === id ? { ...protest, boletoUploaded: true } : protest));
    }
    await load();
  }

  useEffect(() => { load(); }, [id]);

  if (!item) return <div className="panel">Carregando...</div>;

  return (
    <section>
      <div className="page-title">
        <h1>Detalhes do Protesto</h1>
        <p>{item.protocol} - {item.debtor.name}</p>
      </div>
      <div className="details-grid">
        <div className="panel">
          <h2>Dados básicos</h2>
          <dl className="info-list">
            <dt>Protocolo</dt><dd>{item.protocol}</dd>
            <dt>Número do título</dt><dd>{item.titleNumber}</dd>
            <dt>Devedor</dt><dd>{item.debtor.name}</dd>
            <dt>Documento</dt><dd>{item.debtor.document}</dd>
            <dt>Credor</dt><dd>{item.creditor?.name ?? "-"}</dd>
            <dt>Valor</dt><dd>R$ {Number(item.amount).toFixed(2)}</dd>
            <dt>Status</dt><dd><Badge value={item.protestStatus} /></dd>
            <dt>Pagamento</dt><dd><Badge value={item.paymentStatus} /></dd>
          </dl>
        </div>
        <div className="panel form-grid">
          <h2>Ações</h2>
          <form onSubmit={markClientPaid} className="inline-form">
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            <input type="number" min="0.01" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            <button type="submit">Cliente pagou</button>
          </form>
          <form onSubmit={informBoleto} className="inline-form">
            <input type="date" value={boletoDueDate} onChange={(e) => setBoletoDueDate(e.target.value)} />
            <input type="number" min="0.01" step="0.01" value={boletoAmount} onChange={(e) => setBoletoAmount(e.target.value)} />
            <button type="submit">Enviar boleto ao chefe</button>
          </form>
          <label>
            Anexar boleto
            <input type="file" onChange={uploadAttachment} />
          </label>
          <button type="button" onClick={markBoletoPaid}>Marcar boleto como pago</button>
          <form onSubmit={saveNotes} className="form-grid">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações ou pendências" />
            <button type="submit">Salvar observação</button>
          </form>
        </div>
      </div>
      <div className="panel">
        <h2>Histórico</h2>
        <div className="timeline">
          {item.histories?.map((history) => (
            <div key={history.id} className="timeline-item">
              <strong>{history.action}</strong>
              <span>{history.description}</span>
              <small>{history.user.name} - {new Date(history.createdAt).toLocaleString("pt-BR")}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
