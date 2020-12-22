import { Action, Estimate, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';
import { EstimateStatus } from '../enums';

type CommonOptionalEstimateProps =
  | 'discount'
  | 'discountPerItem'
  | 'discountType'
  | 'discountVal'
  | 'estimateTemplateId'
  | 'items'
  | 'notes'
  | 'referenceNumber'
  | 'status';

// prettier-ignore
type AddEstimateData = Pick<
  Optional<Estimate, CommonOptionalEstimateProps>,
  'customerId' | 'estimateDate' | 'expiryDate' | 'estimateNumber' | CommonOptionalEstimateProps
>;

// prettier-ignore
type UpdateEstimateData = Pick<
  Optional<Estimate, 'customerId' | 'estimateDate' | 'expiryDate' | 'estimateNumber' | CommonOptionalEstimateProps>,
  'id' | 'customerId' | 'estimateDate' | 'expiryDate' | 'estimateNumber' | CommonOptionalEstimateProps
>;

export type EstimatesActions = {
  add: (data: AddEstimateData) => Estimate;
  update: (data: UpdateEstimateData) => Estimate | null;
  remove: (ids: string[]) => Estimate[];
  undoRemove: (ids: string[]) => Estimate[];
  markAccepted: (ids: string[]) => Estimate[];
  markRejected: (ids: string[]) => Estimate[];
  markSent: (ids: string[]) => Estimate[];
};

export const createEstimatesActions: Action<EstimatesActions> = (state, updateState) => ({
  /**
   * Creates an estimate.
   */
  add: (data) => {
    const newEstimate: Estimate = {
      createdAt: getTimestamp(),
      customerId: data.customerId,
      discount: data.discount ?? 0,
      discountPerItem: data.discountPerItem || 'no',
      discountType: data.discountType || 'fixed',
      discountVal: data.discountVal || 0,
      estimateDate: data.estimateDate,
      estimateNumber: data.estimateNumber,
      estimateTemplateId: data.estimateTemplateId || null,
      expiryDate: data.expiryDate,
      id: generateId(),
      isDeleted: false,
      items: data.items || [],
      notes: data.notes || null,
      referenceNumber: data.referenceNumber || null,
      status: data.status || EstimateStatus.DRAFT,
      subTotal: 0, // TODO
      tax: 0, // TODO
      taxes: [], // TODO
      total: 0, // TODO
      updatedAt: getTimestamp(),
    };

    const estimates = [...state.estimates, newEstimate];
    updateState({ estimates });

    return newEstimate;
  },

  /**
   * Updates an estimate.
   */
  update: (data) => {
    const estimate = state.estimates.find((estimate) => data.id === estimate.id);

    if (!estimate) return null;

    const updItem: Estimate = {
      ...estimate,
      customerId: data.customerId || estimate.id,
      discount: data.discount ?? estimate.discount,
      discountPerItem: data.discountPerItem || estimate.discountPerItem,
      discountType: data.discountType || estimate.discountType,
      discountVal: data.discountVal || estimate.discountVal,
      estimateDate: data.estimateDate || estimate.estimateDate,
      estimateNumber: data.estimateNumber || estimate.estimateNumber,
      estimateTemplateId: data.estimateTemplateId || estimate.estimateTemplateId,
      expiryDate: data.expiryDate || estimate.expiryDate,
      items: data.items || estimate.items,
      notes: data.notes || estimate.notes,
      referenceNumber: data.referenceNumber || estimate.referenceNumber,
      status: data.status || estimate.status,
      subTotal: 0, // TODO
      tax: 0, // TODO
      taxes: [], // TODO
      total: 0, // TODO
      updatedAt: getTimestamp(),
    };

    const estimates = [...state.estimates.filter((item) => data.id !== item.id), updItem];
    updateState({ estimates });

    return updItem;
  },

  /**
   * Deletes an estimate.
   */
  remove: (ids) => {
    const removedData = state.estimates.filter((estimate) => ids.includes(estimate.id));
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
});
