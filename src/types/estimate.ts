import { Tax } from './tax';
import { Item } from './item';
import { EstimateStatus } from '../enums';

export type Estimate = {
  createdAt: string;
  customerId: string;
  discount: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  discountVal: number;
  estimateDate: string;
  estimateNumber: string;
  estimateTemplateId: string | null;
  expiryDate: string;
  id: string;
  isDeleted: boolean;
  items: Item[];
  notes: string | null;
  referenceNumber: string | null;
  status: EstimateStatus;
  subTotal: number;
  tax: number;
  taxes: Tax[];
  total: number;
  updatedAt: string;
};

export type EstimateTemplate = {
  createdAt: string;
  id: number;
  name: string;
  path: string;
  updatedAt: string;
  view: string;
};
