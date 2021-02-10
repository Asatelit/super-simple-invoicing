import { DataCollection } from 'types';

export interface SalesByCustomer {
  data: DataCollection<{
    date: string;
    number: string;
    amount: string;
  }[]>;
  totalAmount: string;
}

export interface SalesByItem {
  data: DataCollection<{
    qty: number;
    amount: number;
  }>;
  totalAmount: number;
}

export interface ExpensesReportData {
  data: DataCollection<number>;
  totalExpense: number;
}
