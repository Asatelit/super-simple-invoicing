import { Action, Item, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonRequiredItemProps = 'name' | 'price';
type CommonOptionalItemProps = 'description' | 'taxesIds' | 'unit';

// prettier-ignore
export type ItemsActionsAdd = Pick<
  Optional<Item, CommonOptionalItemProps>,
  CommonRequiredItemProps | CommonOptionalItemProps
>;

// prettier-ignore
export type ItemsActionsUpdate = Pick<
  Optional<Item, 'name' | CommonOptionalItemProps>,
  'id' | CommonRequiredItemProps | CommonOptionalItemProps
>;

export type ItemsActions = {
  add: (data: ItemsActionsAdd) => Item;
  update: (data: ItemsActionsUpdate) => Item | null;
  remove: (ids: string[]) => Item[] | null;
  undoRemove: (ids: string[]) => Item[] | null;
};

export const createItemsActions: Action<ItemsActions> = (state, updateState) => ({
  /**
   * Creates an item.
   */
  add: (data) => {
    const newItem: Item = {
      createdAt: getTimestamp(),
      description: data.description ?? '',
      id: generateId(),
      isDeleted: false,
      name: data.name,
      price: data.price,
      taxesIds: data.taxesIds ?? [],
      unit: data.unit ?? '',
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
      description: data.description ?? item.description,
      name: data.name ?? item.name,
      price: data.price ?? item.price,
      taxesIds: data.taxesIds ?? item.taxesIds,
      unit: data.unit ?? item.unit,
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
    const removedData = state.items.filter((item) => ids.includes(item.id));
    if (!removedData.length) return null;
    const items = state.items.map((item) => (ids.includes(item.id) ? { ...item, isDeleted: true } : item));
    updateState({ items });
    return removedData;
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const recoveredData = state.items.filter((item) => ids.includes(item.id));
    if (!recoveredData.length) return null;
    const items = state.items.map((item) => (ids.includes(item.id) ? { ...item, isDeleted: false } : item));
    updateState({ items });
    return recoveredData;
  },
});
