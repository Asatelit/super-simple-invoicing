import { LineItem, TaxRecord, Customer } from 'types';
import { InvoiceStatus, InvoicePaidStatus } from 'enums';

export type Invoice = {
  createdAt: Date;
  customerId: string | null;
  discountAmount: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  dueDate: Date | null;
  id: string;
  invoiceDate: Date;
  invoiceNumber: string;
  invoiceTemplate: string | null;
  isDeleted: boolean;
  lineItems: LineItem[];
  lineTaxes: TaxRecord[];
  notes: null | string;
  paidStatus: InvoicePaidStatus;
  referenceNumber: null | string;
  sent: Date | null;
  status: InvoiceStatus;
  subTotal: number;
  taxAmount: number;
  taxPerItem: boolean;
  total: number;
  updatedAt: Date;
};

export type MappedInvoice = Invoice & {
  customer: Customer | undefined;
};
