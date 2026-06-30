import type { Protest } from "../types";

export const mockDashboard = {
  total: 3,
  clientPaid: 1,
  pendingBoletos: 1,
  paidBoletos: 0,
  pending: 1,
  protested: 0,
  canceled: 0,
  importedToday: 3
};

export const mockProtests: Protest[] = [
  {
    id: "demo-1",
    protocol: "202500001",
    titleNumber: "TIT001",
    amount: "350.00",
    dueDate: "2025-05-10",
    protestStatus: "IMPORTADO",
    paymentStatus: "NAO_PAGO",
    clientPaid: false,
    boletoRequired: false,
    boletoUploaded: false,
    boletoPaid: false,
    updatedAt: new Date().toISOString(),
    debtor: { name: "Joao da Silva", document: "12345678909", documentType: "CPF" },
    creditor: { name: "Empresa Exemplo LTDA", document: "12345678000195", documentType: "CNPJ" },
    histories: [{ id: "h1", action: "IMPORTACAO", description: "Protesto importado pelo arquivo CSV.", createdAt: new Date().toISOString(), user: { name: "Funcionário Demo", role: "FUNCIONARIO" } }]
  },
  {
    id: "demo-2",
    protocol: "202500002",
    titleNumber: "TIT002",
    amount: "480.75",
    dueDate: "2025-05-12",
    protestStatus: "BOLETO_ENVIADO_AO_CHEFE",
    paymentStatus: "AGUARDANDO_PAGAMENTO_DO_BOLETO",
    clientPaid: true,
    boletoRequired: true,
    boletoUploaded: true,
    boletoDueDate: "2025-05-20",
    boletoAmount: "480.75",
    boletoPaid: false,
    updatedAt: new Date().toISOString(),
    debtor: { name: "Maria Souza", document: "98765432100", documentType: "CPF" },
    creditor: { name: "Comercial Alfa LTDA", document: "11222333000181", documentType: "CNPJ" },
    histories: [
      { id: "h2", action: "BOLETO_INFORMADO", description: "Boleto enviado para pagamento do chefe.", createdAt: new Date().toISOString(), user: { name: "Funcionário Demo", role: "FUNCIONARIO" } },
      { id: "h3", action: "CLIENTE_PAGOU", description: "Cliente pagou R$ 480.75.", createdAt: new Date().toISOString(), user: { name: "Funcionário Demo", role: "FUNCIONARIO" } }
    ]
  },
  {
    id: "demo-3",
    protocol: "202500003",
    titleNumber: "TIT003",
    amount: "1200.00",
    dueDate: "2025-05-20",
    protestStatus: "PENDENTE",
    paymentStatus: "PENDENTE_CONFIRMACAO",
    clientPaid: false,
    boletoRequired: false,
    boletoUploaded: false,
    boletoPaid: false,
    updatedAt: new Date().toISOString(),
    debtor: { name: "Carlos Pereira", document: "11144477735", documentType: "CPF" },
    creditor: { name: "Servicos Beta LTDA", document: "44555666000128", documentType: "CNPJ" },
    histories: [{ id: "h4", action: "PENDENCIA", description: "Caso precisa de atenção.", createdAt: new Date().toISOString(), user: { name: "Administrador Demo", role: "ADMIN" } }]
  }
];

export function getMockProtests() {
  const saved = localStorage.getItem("mockProtests");
  if (saved) return JSON.parse(saved) as Protest[];
  localStorage.setItem("mockProtests", JSON.stringify(mockProtests));
  return mockProtests;
}

export function saveMockProtests(items: Protest[]) {
  localStorage.setItem("mockProtests", JSON.stringify(items));
}
