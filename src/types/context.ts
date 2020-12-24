import { Customer, Invoice, Item, Estimate, Expense, Settings, Payment } from '../types';
import * as A from '../actions';
import { Tax } from './tax';

export type AppState = {
  customers: Customer[];
  estimates: Estimate[];
  expenses: Expense[];
  invoices: Invoice[];
  isLoading: boolean;
  items: Item[];
  payments: Payment[];
  settings: Settings;
  taxes: Tax[];
};

export type AppActions = {
  customers: A.CustomersActions;
  estimates: A.EstimatesActions;
  expenses: A.ExpensesActions;
  invoices: A.InvoicesActions;
  items: A.ItemsActions;
  payments: A.PaymentsActions;
  settings: A.SettingsActions;
  taxes: A.TaxActions;
};

export type AppViews = {};

export type AppHelpers = {};
