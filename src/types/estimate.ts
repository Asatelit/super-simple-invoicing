import { LineItem, TaxRecord, Customer } from 'types';
import { EstimateStatus } from '../enums';

export type Estimate = {
  createdAt: Date;
  customerId: string | null;
  discountAmount: number;
  discountValue: number;
  discountPerItem: 'no' | 'yes';
  discountType: 'fixed' | 'percentage';
  estimateDate: Date;
  estimateNumber: string;
  estimateTemplateId: string | null;
  expiryDate: Date | null;
  id: string;
  isDeleted: boolean;
  lineItems: LineItem[];
  notes: string | null;
  referenceNumber: string | null;
  status: EstimateStatus;
  sent: boolean;
  subTotal: number;
  taxAmount: number;
  taxPerItem: boolean;
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
