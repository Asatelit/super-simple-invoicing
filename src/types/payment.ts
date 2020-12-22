export type Payment = {
  amount: number;
  createdAt: string;
  customerId: string;
  id: string;
  invoiceId: string | null;
  notes: string | null;
  paymentDate: string;
  paymentMode: string | null;
  paymentNumber: string;
  updatedAt: string;
};
