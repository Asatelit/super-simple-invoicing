import { Action, Invoice, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';
import { InvoicePaidStatus, InvoiceStatus } from '../enums';

type CommonOptionalInvoiceProps =
  | 'invoiceTemplateId'
  | 'items'
  | 'notes'
  | 'referenceNumber'
  | 'status'
  | 'sent'
  | 'paidStatus';

// prettier-ignore
type AddInvoiceData = Pick<
  Optional<Invoice, CommonOptionalInvoiceProps>,
  'customerId' | 'invoiceDate' | 'invoiceNumber' | 'dueDate' | CommonOptionalInvoiceProps
>;

// prettier-ignore
type UpdateInvoiceData = Pick<
  Optional<Invoice, 'customerId' | 'dueDate' | CommonOptionalInvoiceProps>,
  'id' | 'customerId'  | 'invoiceDate' | 'invoiceNumber' | 'dueDate' | CommonOptionalInvoiceProps
>;

export type InvoicesActions = {
  add: (data: AddInvoiceData) => Invoice;
  update: (data: UpdateInvoiceData) => Invoice | null;
  remove: (ids: string[]) => Invoice[] | null;
  undoRemove: (ids: string[]) => Invoice[] | null;
  markSent: (ids: string[]) => Invoice[] | null;
};

export const createInvoicesActions: Action<InvoicesActions> = (state, updateState) => ({
  /**
   * Creates an invoice.
   */
  add: (data) => {
    const newInvoice: Invoice = {
      createdAt: getTimestamp(),
      discount: 0, // TODO
      dueAmount: 0, // TODO
      dueDate: data.dueDate,
      id: generateId(),
      invoiceDate: data.invoiceDate,
      invoiceNumber: data.invoiceNumber,
      // invoiceTemplate: string | null; // { id: 1; name: 'Template 1'; view: 'invoice1' };
      invoiceTemplateId: data.invoiceTemplateId || null,
      items: data.items || [],
      notes: data.notes || null,
      paidStatus: data.paidStatus || InvoicePaidStatus.UNPAID,
      referenceNumber: data.referenceNumber || null,
      sent: data.sent || null,
      status: data.status || InvoiceStatus.DRAFT,
      subTotal: 0, // TODO
      tax: 0, // TODO
      total: 0, // TODO
      updatedAt: getTimestamp(),
      customerId: data.customerId,
      isDeleted: false,
    };

    const invoices = [...state.invoices, newInvoice];
    updateState({ invoices });

    return newInvoice;
  },

  /**
   * Updates an invoice.
   */
  update: (data) => {
    const invoice = state.invoices.find((invoice) => data.id === invoice.id);

    if (!invoice) return null;

    const updInvoice: Invoice = {
      ...invoice,
      customerId: data.customerId || invoice.id,
      items: data.items || invoice.items,
      notes: data.notes || invoice.notes,
      referenceNumber: data.referenceNumber || invoice.referenceNumber,
      status: data.status || invoice.status,
      subTotal: 0, // TODO
      tax: 0, // TODO
      total: 0, // TODO
      updatedAt: getTimestamp(),
    };

    const invoices = [...state.invoices.filter((invoice) => data.id !== invoice.id), updInvoice];
    updateState({ invoices });

    return updInvoice;
  },

  /**
   * Deletes an invoice.
   */
  remove: (ids) => {
    const removedData = state.invoices.filter((invoice) => ids.includes(invoice.id));
    if (!removedData.length) return null;
    const invoices = state.invoices.map((invoice) =>
      ids.includes(invoice.id) ? { ...invoice, isDeleted: true } : invoice,
    );
    updateState({ invoices });
    return removedData;
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const recoveredData = state.invoices.filter((invoice) => ids.includes(invoice.id));
    if (!recoveredData.length) return null;
    const invoices = state.invoices.map((invoice) =>
      ids.includes(invoice.id) ? { ...invoice, isDeleted: false } : invoice,
    );
    updateState({ invoices });
    return recoveredData;
  },

  /**
   * Mark as sent.
   */
  markSent: (ids) => {
    const sentData = state.invoices.filter((invoice) => ids.includes(invoice.id));
    if (!sentData.length) return null;
    const invoices = state.invoices.map((invoice) =>
      ids.includes(invoice.id) ? { ...invoice, sent: getTimestamp(), status: InvoiceStatus.SENT } : invoice,
    );
    updateState({ invoices });
    return sentData;
  },
});
