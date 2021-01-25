import { Action, Estimate, Optional, LineItem } from '../types';
import { getTimestamp, generateId } from '../utils';
import { EstimateStatus } from '../enums';

type ReqiredItemRecordProps = 'itemId' | 'price' | 'quantity' | 'unit';
type OptionalItemRecordProps = 'description' | 'discountType' | 'discountValue' | 'lineTaxes';

// prettier-ignore
export type EstimateActionsAddItemProps = Pick<
  Optional<LineItem, OptionalItemRecordProps>,
  ReqiredItemRecordProps | OptionalItemRecordProps
>;

type EstimateActionsUpdateCommonProps =
  | 'id'
  | 'customerId'
  | 'discountType'
  | 'discountValue'
  | 'discountPerItem'
  | 'estimateDate'
  | 'estimateNumber'
  | 'estimateTemplateId'
  | 'expiryDate'
  | 'lineItems'
  | 'notes'
  | 'referenceNumber'
  | 'lineTaxes'
  | 'status'
  | 'taxPerItem';

export type EstimateActionsCalculateProps = Pick<
  Optional<Estimate, EstimateActionsUpdateCommonProps>,
  EstimateActionsUpdateCommonProps
>;

export type EstimatesActions = {
  addItem: (data: EstimateActionsAddItemProps, estimateId: string) => Estimate | null;
  calculate: (data?: EstimateActionsCalculateProps, estimate?: Estimate) => Estimate;
  update: (data: Estimate) => Estimate | null;
  remove: (ids: string[]) => Estimate[] | null;
  undoRemove: (ids: string[]) => Estimate[] | null;
  markAccepted: (ids: string[]) => Estimate[];
  markRejected: (ids: string[]) => Estimate[];
  markSent: (ids: string[]) => Estimate[];
};

export const createEstimatesActions: Action<EstimatesActions> = (state, updateState) => {
  const getNewEstimate = (): Estimate => ({
    createdAt: getTimestamp(),
    customerId: null,
    discountAmount: 0,
    discountPerItem: 'no',
    discountType: 'fixed',
    discountValue: 0,
    estimateDate: getTimestamp(),
    estimateNumber: `${state.settings.estimatePrefix}-${1001 + state.estimates.length}`,
    estimateTemplateId: null,
    expiryDate: null,
    id: '',
    isDeleted: false,
    lineItems: [],
    lineTaxes: [],
    notes: null,
    referenceNumber: null,
    status: EstimateStatus.DRAFT,
    subTotal: 0,
    taxAmount: 0,
    taxPerItem: state.settings.taxPerItem,
    total: 0,
    updatedAt: getTimestamp(),
  });

  // Calculate helper
  const calculateEstimate = (data: Partial<Estimate> = {}, estimate: Estimate): Estimate => {
    const discountPerItem = data.discountPerItem ?? estimate.discountPerItem;
    const discountValue = data.discountValue ?? estimate.discountValue;
    const discountType = data.discountType ?? estimate.discountType;

    // LineItems calculation
    let lineItems = data.lineItems ?? estimate.lineItems;
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
    const lineTaxes = data.lineTaxes ?? estimate.lineTaxes;
    const taxAmounts = lineTaxes.map((entity) => (subTotal / 100) * entity.percent);
    const taxAmount = taxAmounts.reduce((a, b) => a + (b || 0), 0);

    const total = subTotal - discountAmount + taxAmount;

    return {
      ...estimate,
      discountAmount,
      discountPerItem,
      discountType,
      discountValue,
      lineItems,
      lineTaxes,
      subTotal,
      taxAmount,
      total,
      customerId: data.customerId ?? estimate.customerId,
      estimateDate: data.estimateDate ?? estimate.estimateDate,
      estimateNumber: data.estimateNumber ?? estimate.estimateNumber,
      estimateTemplateId: data.estimateTemplateId ?? estimate.estimateTemplateId,
      expiryDate: data.expiryDate ?? estimate.expiryDate,
      notes: data.notes ?? estimate.notes,
      referenceNumber: data.referenceNumber ?? estimate.referenceNumber,
      status: data.status ?? estimate.status,
      updatedAt: getTimestamp(),
    };
  };

  return {
    /**
     * Add item to estimate.
     */
    addItem: (data, estimateId) => {
      const estimate = state.estimates.find((entity) => estimateId === entity.id);

      if (!estimate) return null;

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

      const updEstimate = calculateEstimate({ lineItems: [...estimate.lineItems, item] }, estimate);
      const estimates = [...state.estimates.filter((item) => item.id !== estimateId), updEstimate];
      updateState({ estimates });

      return updEstimate;
    },

    /**
     * Updates an estimate.
     */
    update: (data) => {
      const updEstimate = data.id ? data : { ...data, id: generateId() };
      const estimates = [...state.estimates.filter((item) => item.id !== updEstimate.id), updEstimate];
      updateState({ estimates });
      return updEstimate;
    },

    calculate: (data, estimate = getNewEstimate()) => calculateEstimate(data, estimate),

    /**
     * Deletes an estimate.
     */
    remove: (ids) => {
      const removedData = state.estimates.filter((estimate) => ids.includes(estimate.id));
      if (!removedData.length) return null;
      const estimates = state.estimates.map((item) =>
        ids.includes(item.id) ? { ...item, isDeleted: true } : item,
      );
      updateState({ estimates });
      return removedData;
    },

    /**
     * Undo delete.
     */
    undoRemove: (ids) => {
      const recoveredData = state.estimates.filter((estimate) => ids.includes(estimate.id));
      if (!recoveredData.length) return null;
      const estimates = state.estimates.map((item) =>
        ids.includes(item.id) ? { ...item, isDeleted: false } : item,
      );
      updateState({ estimates });
      return recoveredData;
    },

    /**
     * Mark estimates as sent.
     */
    markSent: (ids) => {
      const markedData = state.estimates.filter((estimate) => ids.includes(estimate.id));
      const estimates = state.estimates.map((item) =>
        ids.includes(item.id) ? { ...item, status: EstimateStatus.SENT } : item,
      );
      updateState({ estimates });
      return markedData;
    },

    /**
     * Mark estimates as accepted.
     */
    markAccepted: (ids) => {
      const markedData = state.estimates.filter((estimate) => ids.includes(estimate.id));
      const estimates = state.estimates.map((item) =>
        ids.includes(item.id) ? { ...item, status: EstimateStatus.ACCEPTED } : item,
      );
      updateState({ estimates });
      return markedData;
    },

    /**
     * Mark estimates as rejected.
     */
    markRejected: (ids) => {
      const markedData = state.estimates.filter((estimate) => ids.includes(estimate.id));
      const estimates = state.estimates.map((item) =>
        ids.includes(item.id) ? { ...item, status: EstimateStatus.REJECTED } : item,
      );
      updateState({ estimates });
      return markedData;
    },
  };
};
