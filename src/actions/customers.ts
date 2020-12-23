import { Action, Customer, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonRequiredCustomerProps = 'name';
type CommonOptionalCustomerProps =
  | 'avatar'
  | 'contactName'
  | 'currencyId'
  | 'media'
  | 'email'
  | 'phone'
  | 'website'
  | 'shippingAddressLine1'
  | 'shippingAddressLine2'
  | 'shippingCity'
  | 'shippingCountry'
  | 'shippingFax'
  | 'shippingPhone'
  | 'shippingState'
  | 'shippingZip'
  | 'billingAddressLine1'
  | 'billingAddressLine2'
  | 'billingCity'
  | 'billingCountry'
  | 'billingFax'
  | 'billingPhone'
  | 'billingState'
  | 'billingZip';

// prettier-ignore
export type CustomersActionsAdd = Pick<
  Optional<Customer, CommonOptionalCustomerProps>,
  CommonRequiredCustomerProps | CommonOptionalCustomerProps
>;

// prettier-ignore
export type CustomersActionsUpdate = Pick<
  Optional<Customer, CommonRequiredCustomerProps | CommonOptionalCustomerProps>,
  'id' | CommonRequiredCustomerProps | CommonOptionalCustomerProps
>;

export type CustomersActions = {
  add: (data: CustomersActionsAdd) => Customer;
  update: (data: CustomersActionsUpdate) => Customer | null;
  remove: (ids: string[]) => Customer[] | null;
  undoRemove: (ids: string[]) => Customer[] | null;
};

export const createCustomersActions: Action<CustomersActions> = (state, updateState) => ({
  /**
   * Creates a customer.
   */
  add: (data) => {
    const newCustomer: Customer = {
      avatar: data.avatar ?? '',
      contactName: data.contactName ?? '',
      createdAt: getTimestamp(),
      currencyId: data.currencyId ?? 'USD',
      email: data.email ?? '',
      id: generateId(),
      media: [],
      name: data.name ?? '',
      phone: data.phone ?? '',
      updatedAt: getTimestamp(),
      website: data.website ?? '',
      isDeleted: false,
      shippingAddressLine1: data.shippingAddressLine1 ?? '',
      shippingAddressLine2: data.shippingAddressLine2 ?? '',
      shippingCity: data.shippingCity ?? '',
      shippingCountry: data.shippingCountry ?? '',
      shippingFax: data.shippingFax ?? '',
      shippingPhone: data.shippingPhone ?? '',
      shippingState: data.shippingState ?? '',
      shippingZip: data.shippingZip ?? '',
      billingAddressLine1: data.billingAddressLine1 ?? '',
      billingAddressLine2: data.billingAddressLine2 ?? '',
      billingCity: data.billingCity ?? '',
      billingCountry: data.billingCountry ?? '',
      billingFax: data.billingFax ?? '',
      billingPhone: data.billingPhone ?? '',
      billingState: data.billingState ?? '',
      billingZip: data.billingZip ?? '',
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
      isDeleted: customer.isDeleted,
      shippingAddressLine1: data.shippingAddressLine1 ?? customer.shippingAddressLine1,
      shippingAddressLine2: data.shippingAddressLine2 ?? customer.shippingAddressLine2,
      shippingCity: data.shippingCity ?? customer.shippingCity,
      shippingCountry: data.shippingCountry ?? customer.shippingCountry,
      shippingFax: data.shippingFax ?? customer.shippingFax,
      shippingPhone: data.shippingPhone ?? customer.shippingPhone,
      shippingState: data.shippingState ?? customer.shippingState,
      shippingZip: data.shippingZip ?? customer.shippingZip,
      billingAddressLine1: data.billingAddressLine1 ?? customer.billingAddressLine1,
      billingAddressLine2: data.billingAddressLine2 ?? customer.billingAddressLine2,
      billingCity: data.billingCity ?? customer.billingCity,
      billingCountry: data.billingCountry ?? customer.billingCountry,
      billingFax: data.billingFax ?? customer.billingFax,
      billingPhone: data.billingPhone ?? customer.billingPhone,
      billingState: data.billingState ?? customer.billingState,
      billingZip: data.billingZip ?? customer.billingZip,
    };

    const customers = [...state.customers.filter((customer) => data.id !== customer.id), updCustomer];

    updateState({ customers });
    return updCustomer;
  },

  /**
   * Deletes a customer.
   */
  remove: (ids) => {
    const removedData = state.customers.filter((invoice) => ids.includes(invoice.id));
    if (!removedData.length) return null;
    const customers = state.customers.map((customer) =>
      ids.includes(customer.id) ? { ...customer, isDeleted: true } : customer,
    );
    updateState({ customers });
    return removedData;
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const recoveredData = state.customers.filter((invoice) => ids.includes(invoice.id));
    if (!recoveredData.length) return null;
    const customers = state.customers.map((customer) =>
      ids.includes(customer.id) ? { ...customer, isDeleted: false } : customer,
    );
    updateState({ customers });
    return recoveredData;
  },
});
