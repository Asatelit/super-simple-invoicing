import { Action, Tax, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonOptionalTaxProps = 'collectiveTax' | 'compoundTax' | 'description' | 'percent';
type CommonReqiredTaxProps = 'name';

// prettier-ignore
export type TaxActionsAddProps = Pick<
  Optional<Tax, CommonOptionalTaxProps>,
  CommonReqiredTaxProps | CommonOptionalTaxProps
>;

// prettier-ignore
export type TaxActionsUpdateProps = Pick<
  Optional<Tax, CommonReqiredTaxProps | CommonOptionalTaxProps>,
  'id' | CommonReqiredTaxProps | CommonOptionalTaxProps
>;

export type TaxActions = {
  add: (data: TaxActionsAddProps) => Tax;
  update: (data: TaxActionsUpdateProps) => Tax | null;
  remove: (ids: string[]) => Tax[] | null;
  undoRemove: (ids: string[]) => Tax[] | null;
};

export const createTaxesActions: Action<TaxActions> = (state, updateState) => ({
  /**
   * Creates a tax.
   */
  add: (data) => {
    const newItem: Tax = {
      collectiveTax: data.collectiveTax ?? false,
      compoundTax: data.compoundTax ?? false,
      createdAt: getTimestamp(),
      description: data.description ?? '',
      id: generateId(),
      isDeleted: false,
      name: data.name,
      percent: data.percent ?? 0,
      updatedAt: getTimestamp(),
    };

    const taxes = [...state.taxes, newItem];
    updateState({ taxes });

    return newItem;
  },

  /**
   * Updates a tax.
   */
  update: (data) => {
    const tax = state.taxes.find((tax) => data.id === tax.id);

    if (!tax) return null;

    const updTax: Tax = {
      ...tax,
      collectiveTax: data.collectiveTax ?? tax.collectiveTax,
      compoundTax: data.compoundTax ?? tax.compoundTax,
      description: data.description ?? tax.description,
      name: data.name ?? tax.name,
      percent: data.percent ?? tax.percent,
      updatedAt: getTimestamp(),
    };

    const taxes = [...state.taxes.filter((taxes) => data.id !== taxes.id), updTax];
    updateState({ taxes });

    return updTax;
  },

  /**
   * Deletes a tax.
   */
  remove: (ids) => {
    const removedData = state.taxes.filter((invoice) => ids.includes(invoice.id));
    if (!removedData.length) return null;
    const taxes = state.taxes.map((tax) => (ids.includes(tax.id) ? { ...tax, isDeleted: true } : tax));
    updateState({ taxes });
    return removedData;
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const recoveredData = state.taxes.filter((invoice) => ids.includes(invoice.id));
    if (!recoveredData.length) return null;
    const taxes = state.taxes.map((tax) => (ids.includes(tax.id) ? { ...tax, isDeleted: false } : tax));
    updateState({ taxes });
    return recoveredData;
  },
});
