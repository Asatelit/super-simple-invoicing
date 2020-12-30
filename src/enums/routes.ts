export enum Routes {
  Login = '/login',
  SignUp = '/create-account',
  Admin = '/admin',
  Dashboard = '/admin/dashboard',
  Reports = '/admin/reports',
  // Customer
  CustomersList = '/admin/customers',
  CustomersCreate = '/admin/customers/create',
  CustomersEdit = '/admin/customers/:id/edit',
  CustomersView = '/admin/customers/:id/view',
  // Items
  ItemsList = '/admin/items',
  ItemsCreate = '/admin/items/create',
  ItemsEdit = '/admin/items/:id/edit',
  ItemsView = '/admin/items/:id/view',
  // Estimates
  EstimatesList = '/admin/estimates',
  EstimatesCreate = '/admin/estimates/create',
  EstimatesEdit = '/admin/estimates/:id/edit',
  EstimatesView = '/admin/estimates/:id/view',
  // Invoices
  InvoicesList = '/admin/invoices',
  InvoicesCreate = '/admin/invoices/create',
  InvoicesEdit = '/admin/invoices/:id/edit',
  InvoicesView = '/admin/invoices/:id/view',
  // Payments
  PaymentsList = '/admin/payments',
  PaymentsCreate = '/admin/payments/create',
  // Expenses
  ExpensesList = '/admin/expenses',
  ExpensesCreate = '/admin/expenses/create',
  // Settings
  Settings = '/admin/settings',
  SettingsTaxAdd = '/admin/settings/tax/add',
  SettingsTaxEdit = '/admin/settings/tax/:id/edit',
}
