export type UserRole = "FUNCIONARIO" | "CHEFE" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Protest = {
  id: string;
  protocol: string;
  titleNumber: string;
  amount: string;
  dueDate: string;
  protestStatus: string;
  paymentStatus: string;
  clientPaid: boolean;
  boletoRequired: boolean;
  boletoUploaded: boolean;
  boletoDueDate?: string;
  boletoAmount?: string;
  boletoPaid: boolean;
  updatedAt: string;
  notes?: string;
  debtor: { name: string; document: string; documentType: string };
  creditor?: { name: string; document: string; documentType: string };
  histories?: Array<{ id: string; action: string; description: string; createdAt: string; user: { name: string; role: string } }>;
};
