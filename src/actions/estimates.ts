import { Action, Estimate, Optional, ItemRecord } from '../types';
import { getTimestamp, generateId } from '../utils';
import { EstimateStatus } from '../enums';

type CommonReqiredEstimateProps = 'customerId' | 'estimateDate' | 'expiryDate' | 'estimateNumber';
type CommonOptionalEstimateProps =
  | 'discountValue'
  | 'discountPerItem'
  | 'discountType'
  | 'estimateTemplateId'
  | 'items'
  | 'notes'
  | 'referenceNumber'
  | 'status'
  | 'taxes'
  | 'taxPerItem';

// prettier-ignore
export type EstimateActionsAddProps = Pick<
  Optional<Estimate, CommonOptionalEstimateProps>,
  CommonReqiredEstimateProps | CommonOptionalEstimateProps
>;

// prettier-ignore
export type EstimateActionsUpdateProps = Pick<
  Optional<Estimate, CommonReqiredEstimateProps | CommonOptionalEstimateProps>,
  'id' | CommonReqiredEstimateProps | CommonOptionalEstimateProps
>;

type ReqiredItemRecordProps = 'itemId' | 'price' | 'quantity' | 'unit';
type OptionalItemRecordProps = 'description' | 'discountType' | 'discountValue' | 'taxes';

// prettier-ignore
export type EstimateActionsAddItemProps = Pick<
  Optional<ItemRecord, OptionalItemRecordProps>,
  ReqiredItemRecordProps | OptionalItemRecordProps
>;

export type EstimatesActions = {
  add: (data: EstimateActionsAddProps) => Estimate;
  addItem: (data: EstimateActionsAddItemProps, estimateId: string) => Estimate | null;
  update: (data: EstimateActionsUpdateProps) => Estimate | null;
  remove: (ids: string[]) => Estimate[] | null;
  undoRemove: (ids: string[]) => Estimate[] | null;
  markAccepted: (ids: string[]) => Estimate[];
  markRejected: (ids: string[]) => Estimate[];
  markSent: (ids: string[]) => Estimate[];
};

export const createEstimatesActions: Action<EstimatesActions> = (state, updateState) => {
  // Update helper
  const updateEstimate = (data: Partial<Estimate>, estimate: Estimate): Estimate => {
    const items = data.items ?? estimate.items;
    const subTotal = items.reduce((a, b) => a + (b['price'] || 0), 0);

    // Discount calculation
    const discountValue = data.discountAmount ?? estimate.discountAmount;
    const discountPerItem = data.discountPerItem ?? estimate.discountPerItem;
    const discountType = data.discountType ?? estimate.discountType;

    let discountAmount = 0;

    if (discountPerItem) {
      discountAmount = items.reduce((a, b) => a + (b['discountAmount'] || 0), 0);
    } else {
      discountAmount = discountType === 'fixed' ? discountValue : (subTotal * 100) / discountValue;
    }

    // Taxes calculation
    const taxes = data.taxes ?? estimate.taxes;
    const taxAmounts = taxes.map((entity) => (subTotal / 100) * entity.percent);
    const taxAmount = taxAmounts.reduce((a, b) => a + (b || 0), 0);

    const total = subTotal - discountAmount + taxAmount;

    return {
      ...estimate,
      discountAmount,
      discountPerItem,
      discountType,
      discountValue,
      subTotal,
      taxAmount,
      taxes,
      total,
      customerId: data.customerId ?? estimate.customerId,
      estimateDate: data.estimateDate ?? estimate.estimateDate,
      estimateNumber: data.estimateNumber ?? estimate.estimateNumber,
      estimateTemplateId: data.estimateTemplateId ?? estimate.estimateTemplateId,
      expiryDate: data.expiryDate ?? estimate.expiryDate,
      items: data.items ?? estimate.items,
      notes: data.notes ?? estimate.notes,
      referenceNumber: data.referenceNumber ?? estimate.referenceNumber,
      status: data.status ?? estimate.status,
      updatedAt: getTimestamp(),
    };
  };

  return {
    /**
     * Creates an estimate.
     */
    add: (data) => {
      const discountValue = data.discountValue ?? 0;
      const items = data.items ?? [];
      const subTotal = items.reduce((a, b) => a + (b['price'] || 0), 0);
      const taxes = data.taxes ?? [];
      const taxAmount = 0;

      const newEstimate = updateEstimate(
        {},
        {
          discountValue,
          items,
          subTotal,
          taxAmount,
          taxes,
          createdAt: getTimestamp(),
          customerId: data.customerId,
          discountAmount: 0,
          discountPerItem: data.discountPerItem ?? 'no',
          discountType: data.discountType ?? 'fixed',
          estimateDate: data.estimateDate,
          estimateNumber: data.estimateNumber,
          estimateTemplateId: data.estimateTemplateId ?? '',
          expiryDate: data.expiryDate,
          id: generateId(),
          isDeleted: false,
          notes: data.notes ?? '',
          referenceNumber: data.referenceNumber ?? '',
          status: data.status ?? EstimateStatus.DRAFT,
          taxPerItem: data.taxPerItem ?? 'no',
          total: 0,
          updatedAt: getTimestamp(),
        },
      );

      const estimates = [...state.estimates, newEstimate];
      updateState({ estimates });

      return newEstimate;
    },

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
      const taxes = data.taxes?.length
        ? data.taxes.map((entity) => ({ ...entity, amount: (amount / 100) * entity.percent }))
        : [];
      const taxAmount = taxes.reduce((a, b) => a + (b.amount || 0), 0);

      const item: ItemRecord = {
        amount,
        discountAmount,
        discountType,
        discountValue,
        taxAmount,
        taxes,
        description: data.description ?? '',
        itemId: data.itemId,
        price: data.price,
        quantity: data.quantity,
        total: amount - discountAmount + taxAmount,
        unit: data.unit,
      };

      const updEstimate = updateEstimate({ items: [...estimate.items, item] }, estimate);
      const estimates = [...state.estimates.filter((item) => item.id !== estimateId), updEstimate];
      updateState({ estimates });

      return updEstimate;
    },

    /**
     * Updates an estimate.
     */
    update: (data) => {
      const estimate = state.estimates.find((estimate) => data.id === estimate.id);

      if (!estimate) return null;

      const updEstimate = updateEstimate(data, estimate);
      const estimates = [...state.estimates.filter((item) => data.id !== item.id), updEstimate];
      updateState({ estimates });

      return updEstimate;
    },

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
