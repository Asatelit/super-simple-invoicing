import { Item } from './item';
import { Customer } from './customer';
import { InvoiceStatus, InvoicePaidStatus } from '../enums';

export type Invoice = {
  createdAt: string;
  discount: number;
  dueAmount: number;
  dueDate: string;
  id: string;
  invoiceDate: string;
  invoiceNumber: string;
  // invoiceTemplate: string | null; // { id: 1; name: 'Template 1'; view: 'invoice1' };
  invoiceTemplateId: string | null;
  items: Item[];
  notes: null | string;
  paidStatus: InvoicePaidStatus;
  referenceNumber: null | number;
  sent: string | null;
  status: InvoiceStatus;
  subTotal: number;
  tax: number;
  total: number;
  updatedAt: string;
  customerId: string;
  isDeleted: boolean;
};

export type MappedInvoice = Invoice & {
  customer: Customer | undefined;
};
