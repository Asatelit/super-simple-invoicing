import { Action, Expense, Optional } from '../types';
import { getTimestamp, generateId } from '../utils';

type CommonOptionalExpenseProps = 'customerId' | 'notes' | 'attachmentReceipt';
type CommonRequiredExpenseProps = 'expenseDate' | 'amount' | 'expenseCategoryId';

// prettier-ignore
type AddExpenseData = Pick<
  Optional<Expense, CommonOptionalExpenseProps>,
  CommonRequiredExpenseProps | CommonOptionalExpenseProps
>;

// prettier-ignore
type UpdateExpenseData = Pick<
  Optional<Expense, CommonOptionalExpenseProps>,
  'id' | CommonRequiredExpenseProps | CommonOptionalExpenseProps
>;

export type ExpensesActions = {
  add: (data: AddExpenseData) => Expense;
  update: (data: UpdateExpenseData) => Expense | null;
  remove: (ids: string[]) => void;
  undoRemove: (ids: string[]) => void;
};

export const createExpensesActions: Action<ExpensesActions> = (state, updateState) => ({
  /**
   * Creates an expense.
   */
  add: (data) => {
    const newExpense: Expense = {
      amount: data.amount,
      attachmentReceipt: data.attachmentReceipt ?? '',
      createdAt: getTimestamp(),
      expenseCategoryId: data.expenseCategoryId,
      expenseDate: data.expenseDate,
      id: generateId(),
      notes: data.notes ?? '',
      updatedAt: getTimestamp(),
      customerId: data.customerId || '',
    };

    const expenses = [...state.expenses, newExpense];
    updateState({ expenses });

    return newExpense;
  },

  /**
   * Updates an expense.
   */
  update: (data) => {
    const current = state.expenses.find((estimate) => data.id === estimate.id);

    if (!current) return null;

    const updItem: Expense = {
      ...current,
      amount: data.amount ?? current.amount,
      attachmentReceipt: data.attachmentReceipt ?? current.attachmentReceipt,
      expenseCategoryId: data.expenseCategoryId ?? current.expenseCategoryId,
      expenseDate: data.expenseDate ?? current.expenseDate,
      notes: data.notes ?? current.notes,
      updatedAt: getTimestamp(),
      customerId: data.customerId || current.customerId,
    };

    const expenses = [...state.expenses.filter((item) => data.id !== item.id), updItem];
    updateState({ expenses });

    return updItem;
  },

  /**
   * Deletes an expense.
   */
  remove: (ids) => {
    const expenses = state.expenses.map((item) =>
      ids.includes(item.id) ? { ...item, isDeleted: true } : item,
    );
    updateState({ expenses });
  },

  /**
   * Undo delete.
   */
  undoRemove: (ids) => {
    const expenses = state.expenses.map((item) =>
      ids.includes(item.id) ? { ...item, isDeleted: false } : item,
    );
    updateState({ expenses });
  },
});
