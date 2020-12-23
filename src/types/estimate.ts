import { Tax } from './tax';
import { Item } from './item';
import { EstimateStatus } from '../enums';

export type Estimate = {
  createdAt: Date;
  customerId: string;
  discount: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  discountVal: number;
  estimateDate: Date;
  estimateNumber: string;
  estimateTemplateId: string | null;
  expiryDate: Date;
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
  updatedAt: Date;
};

export type EstimateTemplate = {
  createdAt: Date;
  id: number;
  name: string;
  path: string;
  updatedAt: Date;
  view: string;
};
