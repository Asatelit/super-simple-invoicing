import { Action, Invoice, Optional, LineItem } from 'types';
import { getTimestamp, generateId } from 'utils';
import { InvoicePaidStatus, InvoiceStatus } from 'enums';

type ReqiredItemRecordProps = 'itemId' | 'price' | 'quantity' | 'unit';
type OptionalItemRecordProps = 'description' | 'discountType' | 'discountValue' | 'lineTaxes';

// prettier-ignore
export type InvoiceActionsAddItemProps = Pick<
  Optional<LineItem, OptionalItemRecordProps>,
  ReqiredItemRecordProps | OptionalItemRecordProps
>;

export type InvoiceActionsCalculateCommonProps =
  | 'id'
  | 'customerId'
  | 'discountType'
  | 'discountValue'
  | 'discountPerItem'
  | 'invoiceDate'
  | 'invoiceNumber'
  | 'invoiceTemplate'
  | 'dueDate'
  | 'lineItems'
  | 'notes'
  | 'referenceNumber'
  | 'lineTaxes'
  | 'status'
  | 'taxPerItem';

export type InvoiceActionsCalculateProps = Pick<
  Optional<Invoice, InvoiceActionsCalculateCommonProps>,
  InvoiceActionsCalculateCommonProps
>;

export type InvoicesActions = {
  addItem: (data: InvoiceActionsAddItemProps, estimateId: string) => Invoice | null;
  calculate: (data?: InvoiceActionsCalculateProps, estimate?: Invoice) => Invoice;
  update: (data: Invoice) => Invoice | null;
  remove: (ids: string[]) => Invoice[] | null;
  undoRemove: (ids: string[]) => Invoice[] | null;
  markSent: (ids: string[]) => Invoice[] | null;
};

export const createInvoicesActions: Action<InvoicesActions> = (state, updateState) => {
  const getNewInvoice = (): Invoice => ({
    createdAt: getTimestamp(),
    customerId: null,
    discountAmount: 0,
    discountPerItem: 'no',
    discountType: 'fixed',
    discountValue: 0,
    invoiceDate: getTimestamp(),
    invoiceNumber: `${state.settings.invoicePrefix}-${1001 + state.invoices.length}`,
    invoiceTemplate: null,
    dueDate: null,
    id: '',
    isDeleted: false,
    lineItems: [],
    lineTaxes: [],
    notes: null,
    referenceNumber: null,
    status: InvoiceStatus.DRAFT,
    subTotal: 0,
    taxAmount: 0,
    taxPerItem: state.settings.taxPerItem,
    total: 0,
    updatedAt: getTimestamp(),
    paidStatus: InvoicePaidStatus.UNPAID,
    sent: null,
  });

  // Calculate helper
  const calculateInvoice = (data: Partial<Invoice> = {}, invoice: Invoice): Invoice => {
    const discountPerItem = data.discountPerItem ?? invoice.discountPerItem;
    const discountValue = data.discountValue ?? invoice.discountValue;
    const discountType = data.discountType ?? invoice.discountType;

    // LineItems calculation
    let lineItems = data.lineItems ?? invoice.lineItems;
    lineItems = lineItems.map((item) => {
      const amount = item.price * item.quantity;
      return {
        ...item,
        amount,
        total: amount - item.discountAmount + item.taxAmount,
      };
    });

    // Discount calculation
    const isDiscountInPercentage = discountType === 'percentage';
    const subTotal = lineItems.reduce((a, b) => a + b.total, 0);
    const discountAmount = isDiscountInPercentage ? (discountValue / 100) * subTotal : discountValue;

    // Taxes calculation
    let taxAmount = 0;
    const lineTaxes = state.settings.taxPerItem
      ? []
      : state.taxes.map((tax) => ({
          amount: (subTotal / 100) * tax.percent,
          compoundAmount: (subTotal / 100) * tax.percent,
          compoundTax: tax.compoundTax,
          percent: tax.percent,
          taxId: tax.id,
        }));
    taxAmount = lineTaxes.reduce((a, b) => a + (b.amount || 0), 0);

    const total = subTotal - discountAmount + taxAmount;

    return {
      ...invoice,
      discountAmount,
      discountPerItem,
      discountType,
      discountValue,
      lineItems,
      lineTaxes,
      subTotal,
      taxAmount,
      total,
      customerId: data.customerId ?? invoice.customerId,
      invoiceDate: data.invoiceDate ?? invoice.invoiceDate,
      invoiceNumber: data.invoiceNumber ?? invoice.invoiceNumber,
      invoiceTemplate: data.invoiceTemplate ?? invoice.invoiceTemplate,
      dueDate: data.dueDate ?? invoice.dueDate,
      notes: data.notes ?? invoice.notes,
      referenceNumber: data.referenceNumber ?? invoice.referenceNumber,
      status: data.status ?? invoice.status,
      updatedAt: getTimestamp(),
    };
  };

  return {
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

      const updInvoice = calculateInvoice({ lineItems: [...invoice.lineItems, item] }, invoice);
      const invoices = [...state.invoices.filter((item) => item.id !== invoiceId), updInvoice];
      updateState({ invoices });

      return updInvoice;
    },

    /**
     * Updates an invoice.
     */
    update: (data) => {
      const updInvoice = data.id ? data : { ...data, id: generateId() };
      const invoices = [...state.invoices.filter((item) => item.id !== updInvoice.id), updInvoice];
      updateState({ invoices });
      return updInvoice;
    },

    calculate: (data, invoice = getNewInvoice()) => calculateInvoice(data, invoice),

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
