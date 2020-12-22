export type Expense = {
  amount: number;
  attachmentReceipt: string;
  createdAt: string;
  expenseCategoryId: string;
  expenseDate: string;
  id: string;
  notes: string;
  updatedAt: string;
  customerId: string;
};

/**
 * Categories are required for adding expense entries.
 * User can Add or Remove these categories according to his preference.
 */
export type ExpenseCategory = {
  amount: number | string;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  updatedAt: string;
};
