import { LineItem, TaxRecord, Customer } from 'types';
import { EstimateStatus } from '../enums';

export type Estimate = {
  createdAt: Date;
  customerId: string;
  discountAmount: number;
  discountValue: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  estimateDate: Date;
  estimateNumber: string;
  estimateTemplateId: string;
  expiryDate: Date;
  id: string;
  isDeleted: boolean;
  lineItems: LineItem[];
  notes: string;
  referenceNumber: string;
  status: EstimateStatus;
  subTotal: number;
  taxAmount: number;
  taxPerItem: 'no' | 'yes';
  lineTaxes: TaxRecord[];
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

export type MappedEstimate = Estimate & {
  customer: Customer | undefined;
};
