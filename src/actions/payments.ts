import { Action, Payment, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonOptionalPaymentProps = 'invoiceId' | 'paymentMode' | 'notes';

// prettier-ignore
type AddPaymentData = Pick<
  Optional<Payment, CommonOptionalPaymentProps>,
  'customerId' | 'paymentDate' | 'paymentNumber' | 'amount' | CommonOptionalPaymentProps
>;

// prettier-ignore
type UpdatePaymentData = Pick<
  Optional<Payment, 'customerId' | 'paymentDate' | 'paymentNumber' | 'amount' | CommonOptionalPaymentProps>,
  'id' | 'customerId' | 'paymentDate' | 'paymentNumber' | 'amount' | CommonOptionalPaymentProps
>;

export type PaymentsActions = {
  add: (data: AddPaymentData) => Payment;
  update: (data: UpdatePaymentData) => Payment | null;
  remove: (ids: string[]) => void;
  undoRemove: (ids: string[]) => void;
};

export const createPaymentsActions: Action<PaymentsActions> = (state, updateState) => ({
  /**
   * Creates an payment.
   */
  add: (data) => {
    const newPayment: Payment = {
      createdAt: getTimestamp(),
      amount: data.amount,
      customerId: data.customerId,
      id: generateId(),
      invoiceId: data.invoiceId || null,
      notes: data.notes || null,
      paymentDate: data.paymentDate,
      paymentMode: data.paymentMode || null,
      paymentNumber: data.paymentNumber,
      updatedAt: getTimestamp(),
    };

    const payments = [...state.payments, newPayment];
    updateState({ payments });

    return newPayment;
  },

  /**
   * Updates an payment.
   */
  update: (data) => {
    const current = state.payments.find((estimate) => data.id === estimate.id);

    if (!current) return null;

    const updItem: Payment = {
      ...current,
      amount: data.amount ?? current.amount,
      customerId: data.customerId ?? current.customerId,
      invoiceId: data.invoiceId ?? current.invoiceId,
      notes: data.notes ?? current.notes,
      paymentDate: data.paymentDate ?? current.paymentDate,
      paymentMode: data.paymentMode ?? current.paymentMode,
      paymentNumber: data.paymentNumber ?? current.paymentNumber,
      updatedAt: getTimestamp(),
    };

    const payments = [...state.payments.filter((item) => data.id !== item.id), updItem];
    updateState({ payments });

    return updItem;
  },

  /**
   * Deletes an payment.
   */
  remove: (ids) => {
    const payments = state.payments.map((item) => (ids.includes(item.id) ? { ...item, isDeleted: true } : item));
    updateState({ payments });
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const payments = state.payments.map((item) => (ids.includes(item.id) ? { ...item, isDeleted: false } : item));
    updateState({ payments });
  },
});
