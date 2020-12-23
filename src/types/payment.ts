export type Payment = {
  amount: number;
  createdAt: Date;
  customerId: string;
  id: string;
  invoiceId: string | null;
  notes: string | null;
  paymentDate: Date;
  paymentMode: string | null;
  paymentNumber: string;
  updatedAt: Date;
};
