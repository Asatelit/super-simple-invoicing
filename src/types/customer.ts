export type Customer = {
  avatar: string;
  contactName: string;
  createdAt: Date;
  currencySymbol: string;
  currencyFormat: string;
  email: string;
  id: string;
  media: string[];
  name: string;
  phone: string;
  updatedAt: Date;
  website: string;
  isDeleted: boolean;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingCountry: string;
  shippingFax: string;
  shippingPhone: string;
  shippingState: string;
  shippingZip: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingCountry: string;
  billingFax: string;
  billingPhone: string;
  billingState: string;
  billingZip: string;
};

export type CustomerSummaryData = {
  month?: string;
  sales: number;
  receipts: number;
  expenses: number;
  netIncome: number;
};

export type MappedCustomer = Customer & {
  summary: {
    monthly: CustomerSummaryData[];
    overall: CustomerSummaryData;
  };
};
