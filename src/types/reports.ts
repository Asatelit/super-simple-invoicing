import { DataCollection } from 'types';

export interface SalesByCustomer {
  data: DataCollection<{
    date: string;
    number: string;
    amount: string;
  }[]>;
  totalAmount: string;
}
