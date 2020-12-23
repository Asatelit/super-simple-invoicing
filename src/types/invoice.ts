import { Item } from './item';
import { Customer } from './customer';
import { InvoiceStatus, InvoicePaidStatus } from '../enums';

export type Invoice = {
  createdAt: Date;
  discount: number;
  dueAmount: number;
  dueDate: Date;
  id: string;
  invoiceDate: Date;
  invoiceNumber: string;
  // invoiceTemplate: string | null; // { id: 1; name: 'Template 1'; view: 'invoice1' };
  invoiceTemplateId: string | null;
  items: Item[];
  notes: null | string;
  paidStatus: InvoicePaidStatus;
  referenceNumber: null | number;
  sent: Date | null;
  status: InvoiceStatus;
  subTotal: number;
  tax: number;
  total: number;
  updatedAt: Date;
  customerId: string;
  isDeleted: boolean;
};

export type MappedInvoice = Invoice & {
  customer: Customer | undefined;
};
