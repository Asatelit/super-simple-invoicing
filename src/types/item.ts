import { TaxRecord } from 'types';

export type Item = {
  createdAt: Date;
  description: string;
  id: string;
  isDeleted: boolean;
  name: string;
  price: number;
  taxesIds: string[];
  unit: string;
  updatedAt: Date;
};

export type ItemRecord = {
  amount: number;
  description: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  itemId: string;
  price: number;
  quantity: number;
  taxAmount: number;
  taxes: TaxRecord[];
  total: number;
  unit: string;
};
