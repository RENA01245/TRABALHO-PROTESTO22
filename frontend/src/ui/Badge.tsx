const colorMap: Record<string, string> = {
  IMPORTADO: "gray",
  EM_ANALISE: "blue",
  AGUARDANDO_CLIENTE: "yellow",
  CLIENTE_PAGOU: "green",
  BOLETO_PENDENTE: "orange",
  BOLETO_ENVIADO_AO_CHEFE: "orange",
  BOLETO_PAGO: "green",
  PENDENTE: "yellow",
  PROTESTADO: "red",
  CANCELADO: "gray",
  DEVOLVIDO: "gray"
};

export function Badge({ value }: { value: string }) {
  return <span className={`badge ${colorMap[value] ?? "gray"}`}>{value.replaceAll("_", " ")}</span>;
}
