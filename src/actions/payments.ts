import { Action, Payment, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonOptionalPaymentProps = 'invoiceId' | 'paymentMode' | 'notes';
type CommonRequiredPaymentProps = 'customerId' | 'paymentDate' | 'paymentNumber' | 'amount';

// prettier-ignore
type AddPaymentData = Pick<
  Optional<Payment, CommonOptionalPaymentProps>,
  CommonRequiredPaymentProps | CommonOptionalPaymentProps
>;

// prettier-ignore
type UpdatePaymentData = Pick<
  Optional<Payment, 'customerId' | 'paymentDate' | 'paymentNumber' | 'amount' | CommonOptionalPaymentProps>,
  'id' | CommonRequiredPaymentProps | CommonOptionalPaymentProps
>;

export type PaymentsActions = {
  add: (data: AddPaymentData) => Payment;
  update: (data: UpdatePaymentData) => Payment | null;
  delete: (ids: string[]) => Payment[] | null;
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
  delete: (ids) => {
    const removedData = state.payments.filter((payment) => ids.includes(payment.id));
    if (!removedData.length) return null;
    const payments = state.payments.filter((item) => !ids.includes(item.id));
    updateState({ payments });
    return removedData;
  },
});
