import { Action, Tax, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonTaxProps = 'collectiveTax' | 'compoundTax' | 'description' | 'percent';

// prettier-ignore
type AddTaxData = Pick<
  Optional<Tax, CommonTaxProps>,
  'name' | CommonTaxProps
>;

// prettier-ignore
type UpdateTaxData = Pick<
  Optional<Tax, 'name' | CommonTaxProps>,
  'id' | 'name' | CommonTaxProps
>;

export type TaxActions = {
  add: (data: AddTaxData) => Tax;
  update: (data: UpdateTaxData) => Tax | null;
  remove: (ids: string[]) => void;
  undoRemove: (ids: string[]) => void;
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
    const taxes = state.taxes.map((tax) =>
      ids.includes(tax.id) ? { ...tax, isDeleted: true } : tax,
    );
    updateState({ taxes });
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const taxes = state.taxes.map((tax) =>
      ids.includes(tax.id) ? { ...tax, isDeleted: false } : tax,
    );
    updateState({ taxes });
  },
});
