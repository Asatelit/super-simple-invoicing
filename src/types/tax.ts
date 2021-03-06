export type Tax = {
  collectiveTax: boolean;
  compoundTax: boolean;
  createdAt: Date;
  description: string;
  id: string;
  isDeleted: boolean;
  name: string;
  percent: number;
  updatedAt: Date;
};

export type TaxRecord = {
  amount: number;
  compoundAmount: number;
  compoundTax: boolean;
  percent: number;
  taxId: string;
};
