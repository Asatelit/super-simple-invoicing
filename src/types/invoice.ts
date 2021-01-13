import { LineItem, TaxRecord, Customer } from 'types';
import { InvoiceStatus, InvoicePaidStatus } from 'enums';

export type Invoice = {
  createdAt: Date;
  discountAmount: number;
  discountValue: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  dueDate: Date;
  id: string;
  invoiceDate: Date;
  invoiceNumber: string;
  // invoiceTemplate: string | null; // { id: 1; name: 'Template 1'; view: 'invoice1' };
  invoiceTemplateId: string | null;
  lineItems: LineItem[];
  lineTaxes: TaxRecord[];
  notes: null | string;
  paidStatus: InvoicePaidStatus;
  referenceNumber: null | string;
  sent: Date | null;
  status: InvoiceStatus;
  subTotal: number;
  taxAmount: number;
  total: number;
  updatedAt: Date;
  customerId: string;
  isDeleted: boolean;
};

export type MappedInvoice = Invoice & {
  customer: Customer | undefined;
};
