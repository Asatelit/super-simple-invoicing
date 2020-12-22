import { Address } from './address';

export type Customer = {
  avatar: string | null;
  contactName: string | null;
  createdAt: string;
  currencyId: string;
  email: string | null;
  id: string;
  media: string[];
  name: string;
  phone: string | null;
  updatedAt: string;
  website: string | null;
  isDeleted: boolean;
  shippingAddress?: Address;
  billingAddress?: Address;
};
