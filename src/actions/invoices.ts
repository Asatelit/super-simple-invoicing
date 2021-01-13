import { Action, Invoice, Optional, LineItem } from 'types';
import { getTimestamp, generateId } from 'utils';
import { InvoicePaidStatus, InvoiceStatus } from 'enums';

type CommonOptionalInvoiceProps =
  | 'invoiceTemplateId'
  | 'lineItems'
  | 'lineTaxes'
  | 'notes'
  | 'referenceNumber'
  | 'status'
  | 'sent'
  | 'paidStatus'
  | 'discountAmount'
  | 'discountValue'
  | 'discountPerItem'
  | 'discountType';

type CommonRequiredInvoiceProps = 'customerId' | 'invoiceDate' | 'invoiceNumber' | 'dueDate';

// prettier-ignore
export type InvoiceActionsAddProps = Pick<
  Optional<Invoice, CommonOptionalInvoiceProps>,
  CommonRequiredInvoiceProps | CommonOptionalInvoiceProps
>;

// prettier-ignore
export type InvoiceActionsUpdateProps = Pick<
  Optional<Invoice, 'customerId' | 'dueDate' | CommonOptionalInvoiceProps>,
  'id' | CommonRequiredInvoiceProps | CommonOptionalInvoiceProps
>;

type ReqiredItemRecordProps = 'itemId' | 'price' | 'quantity' | 'unit';
type OptionalItemRecordProps = 'description' | 'discountType' | 'discountValue' | 'lineTaxes';

// prettier-ignore
export type InvoiceActionsAddItemProps = Pick<
  Optional<LineItem, OptionalItemRecordProps>,
  ReqiredItemRecordProps | OptionalItemRecordProps
>;

export type InvoicesActions = {
  add: (data: InvoiceActionsAddProps) => Invoice;
  addItem: (data: InvoiceActionsAddItemProps, estimateId: string) => Invoice | null;
  update: (data: InvoiceActionsUpdateProps) => Invoice | null;
  remove: (ids: string[]) => Invoice[] | null;
  undoRemove: (ids: string[]) => Invoice[] | null;
  markSent: (ids: string[]) => Invoice[] | null;
};

export const createInvoicesActions: Action<InvoicesActions> = (state, updateState) => {
  // Update helper
  const updateInvoice = (data: Partial<Invoice>, invoice: Invoice): Invoice => {
    const items = data.lineItems ?? invoice.lineItems;
    const subTotal = items.reduce((a, b) => a + b.total, 0);

    // Discount calculation
    const discountValue = data.discountAmount ?? invoice.discountAmount;
    const discountPerItem = data.discountPerItem ?? invoice.discountPerItem;
    const discountType = data.discountType ?? invoice.discountType;

    let discountAmount = 0;

    if (discountPerItem) {
      discountAmount = items.reduce((a, b) => a + (b['discountAmount'] || 0), 0);
    } else {
      discountAmount = discountType === 'fixed' ? discountValue : (subTotal * 100) / discountValue;
    }

    // Taxes calculation
    const lineTaxes = data.lineTaxes ?? invoice.lineTaxes;
    const taxAmounts = lineTaxes.map((entity) => (subTotal / 100) * entity.percent);
    const taxAmount = taxAmounts.reduce((a, b) => a + (b || 0), 0);

    const total = subTotal - discountAmount + taxAmount;

    return {
      ...invoice,
      discountAmount,
      discountPerItem,
      discountType,
      discountValue,
      subTotal,
      taxAmount,
      lineTaxes,
      total,
      customerId: data.customerId ?? invoice.customerId,
      invoiceDate: data.invoiceDate ?? invoice.invoiceDate,
      invoiceNumber: data.invoiceNumber ?? invoice.invoiceNumber,
      invoiceTemplateId: data.invoiceTemplateId ?? invoice.invoiceTemplateId,
      dueDate: data.dueDate ?? invoice.dueDate,
      lineItems: data.lineItems ?? invoice.lineItems,
      notes: data.notes ?? invoice.notes,
      referenceNumber: data.referenceNumber ?? invoice.referenceNumber,
      status: data.status ?? invoice.status,
      updatedAt: getTimestamp(),
    };
  };

  return {
    /**
     * Creates an invoice.
     */
    add: (data) => {
      const discountValue = data.discountValue ?? 0;
      const items = data.lineItems ?? [];
      const subTotal = items.reduce((a, b) => a + (b['price'] || 0), 0);
      const taxes = data.lineTaxes ?? [];
      const taxAmount = 0;

      const newInvoice = updateInvoice(
        {},
        {
          subTotal,
          taxAmount,
          discountValue,
          lineItems: items,
          lineTaxes: taxes,
          createdAt: getTimestamp(),
          dueDate: data.dueDate,
          id: generateId(),
          invoiceDate: data.invoiceDate,
          invoiceNumber: data.invoiceNumber,
          discountAmount: 0,
          discountPerItem: data.discountPerItem ?? 'no',
          discountType: data.discountType ?? 'fixed',
          // invoiceTemplate: string | null; // { id: 1; name: 'Template 1'; view: 'invoice1' };
          invoiceTemplateId: data.invoiceTemplateId || null,
          notes: data.notes || null,
          paidStatus: data.paidStatus || InvoicePaidStatus.UNPAID,
          referenceNumber: data.referenceNumber || null,
          sent: data.sent || null,
          status: data.status || InvoiceStatus.DRAFT,
          total: 0, // TODO
          updatedAt: getTimestamp(),
          customerId: data.customerId,
          isDeleted: false,
        },
      );

      const invoices = [...state.invoices, newInvoice];
      updateState({ invoices });

      return newInvoice;
    },

    /**
     * Add item to invoice.
     */
    addItem: (data, invoiceId) => {
      const invoice = state.invoices.find((entity) => invoiceId === entity.id);

      if (!invoice) return null;

      const amount = data.quantity * data.price;
      // Discount calculation
      const discountType = data.discountType ?? 'fixed';
      const discountValue = data.discountValue ?? 0;
      const discountAmount = discountType === 'fixed' ? discountValue : (amount * 100) / discountValue;
      // Taxes calculation
      const taxes = data.lineTaxes?.length
        ? data.lineTaxes.map((entity) => ({ ...entity, amount: (amount / 100) * entity.percent }))
        : [];
      const taxAmount = taxes.reduce((a, b) => a + (b.amount || 0), 0);

      const item: LineItem = {
        amount,
        discountAmount,
        discountType,
        discountValue,
        taxAmount,
        lineTaxes: taxes,
        description: data.description ?? '',
        itemId: data.itemId,
        price: data.price,
        quantity: data.quantity,
        total: amount - discountAmount + taxAmount,
        unit: data.unit,
      };

      const updInvoice = updateInvoice({ lineItems: [...invoice.lineItems, item] }, invoice);
      const invoices = [...state.invoices.filter((item) => item.id !== invoiceId), updInvoice];
      updateState({ invoices });

      return updInvoice;
    },

    /**
     * Updates an invoice.
     */
    update: (data) => {
      const invoice = state.invoices.find((invoice) => data.id === invoice.id);
      if (!invoice) return null;
      const updInvoice = updateInvoice(data, invoice);
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
  };
};
