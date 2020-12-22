import { Action, Item, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonItemProps = 'description' | 'taxesIds' | 'unitId';

// prettier-ignore
type AddItemData = Pick<
  Optional<Item, CommonItemProps>,
  'name' | 'price' | CommonItemProps
>;

// prettier-ignore
type UpdateItemData = Pick<
  Optional<Item, 'name' | CommonItemProps>,
  'id' | 'name' | 'price' | CommonItemProps
>;

export type ItemsActions = {
  add: (data: AddItemData) => Item;
  update: (data: UpdateItemData) => Item | null;
  remove: (ids: string[]) => void;
  undoRemove: (ids: string[]) => void;
};

export const createItemsActions: Action<ItemsActions> = (state, updateState) => ({
  /**
   * Creates an item.
   */
  add: (data) => {
    const newItem: Item = {
      createdAt: getTimestamp(),
      description: data.description || '',
      id: generateId(),
      isDeleted: false,
      name: data.name,
      price: data.price,
      taxesIds: data.taxesIds ?? [],
      unitId: data.unitId || null,
      updatedAt: getTimestamp(),
    };

    const items = [...state.items, newItem];
    updateState({ items });

    return newItem;
  },

  /**
   * Updates an item.
   */
  update: (data) => {
    const item = state.items.find((item) => data.id === item.id);

    if (!item) return null;

    const updItem: Item = {
      ...item,
      description: data.description ?? '',
      name: data.name ?? item.name,
      price: data.price ?? item.price,
      taxesIds: data.taxesIds ?? [],
      unitId: data.unitId ?? item.unitId,
      updatedAt: getTimestamp(),
    };

    const items = [...state.items.filter((item) => data.id !== item.id), updItem];
    updateState({ items });

    return updItem;
  },

  /**
   * Deletes an item.
   */
  remove: (ids) => {
    const items = state.items.map((item) =>
      ids.includes(item.id) ? { ...item, isDeleted: true } : item,
    );
    updateState({ items });
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const items = state.items.map((item) =>
      ids.includes(item.id) ? { ...item, isDeleted: false } : item,
    );
    updateState({ items });
  },
});
