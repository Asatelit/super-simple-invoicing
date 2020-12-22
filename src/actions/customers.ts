import { Action, Customer, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonCustomerProps = 'avatar' | 'contactName' | 'currencyId' | 'media' | 'email' | 'phone' | 'website';

// prettier-ignore
type AddCustomerData = Pick<
  Optional<Customer, CommonCustomerProps>,
  'name' | CommonCustomerProps
>;

// prettier-ignore
type UpdateCustomerData = Pick<
  Optional<Customer, 'name' | CommonCustomerProps>,
  'id' | 'name' | CommonCustomerProps
>;

export type CustomersActions = {
  add: (data: AddCustomerData) => Customer;
  update: (data: UpdateCustomerData) => Customer | null;
  remove: (ids: string[]) => void;
  undoRemove: (ids: string[]) => void;
};

export const createCustomersActions: Action<CustomersActions> = (state, updateState) => ({
  /**
   * Creates a customer.
   */
  add: (data) => {
    const newCustomer: Customer = {
      avatar: data.avatar || null,
      contactName: data.contactName || '',
      createdAt: getTimestamp(),
      currencyId: data.currencyId || 'USD',
      email: data.email || null,
      id: generateId(),
      media: [],
      name: data.name || '',
      phone: data.phone || null,
      updatedAt: getTimestamp(),
      website: data.website || null,
      isDeleted: false,
    };

    const customers = [...state.customers, newCustomer];

    updateState({ customers });
    return newCustomer;
  },

  /**
   * Updates a customer.
   */
  update: (data) => {
    const customer = state.customers.find((customer) => data.id === customer.id);

    if (!customer) return null;

    const updCustomer: Customer = {
      avatar: data.avatar ?? customer.avatar,
      contactName: data.contactName ?? customer.contactName,
      createdAt: customer.createdAt,
      currencyId: data.currencyId ?? customer.currencyId,
      email: data.email ?? customer.email,
      id: customer.id,
      media: data.media ?? customer.media,
      name: data.name ?? customer.name,
      phone: data.phone ?? customer.phone,
      updatedAt: getTimestamp(),
      website: data.website ?? customer.website,
      isDeleted: false,
    };

    const customers = [...state.customers.filter((customer) => data.id !== customer.id), updCustomer];

    updateState({ customers });
    return updCustomer;
  },

  /**
   * Deletes a customer.
   */
  remove: (ids) => {
    const customers = state.customers.map((customer) =>
      ids.includes(customer.id) ? { ...customer, isDeleted: true } : customer,
    );
    updateState({ customers });
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const customers = state.customers.map((customer) =>
      ids.includes(customer.id) ? { ...customer, isDeleted: false } : customer,
    );
    updateState({ customers });
  },
});
