export type Expense = {
  amount: number;
  attachmentReceipt: string;
  createdAt: Date;
  customerId: string;
  expenseCategory: string;
  expenseDate: Date;
  id: string;
  notes: string;
  updatedAt: Date;
};

/**
 * Categories are required for adding expense entries.
 * User can Add or Remove these categories according to his preference.
 */
export type ExpenseCategory = {
  amount: number | string;
  createdAt: Date;
  description: string;
  id: string;
  name: string;
  updatedAt: Date;
};
