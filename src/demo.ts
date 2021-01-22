import { subDays, eachDayOfInterval, addDays } from 'date-fns';
import { INIT_STATE } from './assets';
import { getRandomInt, getTimestamp } from './utils';
import { AppState } from './types';
import * as A from './actions';

const fake = {
  names: [
    'Jared Barnett',
    'Julia Holland',
    'Renee Kelley',
    'Marsha Foster',
    'Derek Ward',
    'Robert Simpson',
    'Jeremy Bailey',
    'Scott Owens',
    'Yolanda Bryant',
    'Susan Lynch',
    'Willard Tucker',
    'Juanita Crawford',
  ],
  products: [
    'T-shirt',
    'Bead Necklace Burnt Sienna Cord',
    'Ara Teardrop Pendant',
    'Ryn Necklace - Twilight',
    'Golden State Sea Salt Soap',
    'Lakota Sea Salt Soap',
    'Hella Cheer Riso Card',
    'Cali Cacti Card',
    'Beeswax Party Candles',
    'Mini Brick Earrings',
    'Little Colorspike - No. 3',
  ],
  expenseCategories: [
    'Tolls',
    'Taxi & Parking',
    'Insurance',
    'Lease payments',
    'Rent',
    'Advertising',
    'Education and Training',
    'Restaurants/Dining',
    'Office Supplies',
    'Bank Fees',
    'Taxes & Licenses',
    'Accounting',
    'Phone',
  ],
};

// Generate phone numbers for use as test data
function createPhoneNumber() {
  const fakeNum = Array.from(String(getRandomInt(1000000000, 9999999999)), Number);
  let mask = '(xxx) xxx-xxxx';
  fakeNum.forEach((item) => {
    mask = mask.replace('x', item.toString());
  });

  return mask;
}

export function generateDemoData(): AppState {
  const initialState: AppState = {
    ...INIT_STATE,
    settings: {
      ...INIT_STATE.settings,
      accountEmail: 'admin@treadstone.co',
      accountName: 'Treadstone',
      addressCity: 'Louisville',
      addressCountry: 'United States',
      addressLine1: '407 Cerullo Road',
      addressState: 'Kentucky',
      addressZip: '40244',
      companyName: 'Treadstone LTD',
      email: 'mailbox@treadstone.co',
      phone: '502-380-2582',
    },
  };

  function getFakeState(
    initialValue: AppState,
  ): { state: () => AppState; setState: (newValue: AppState) => void } {
    let value = initialValue;
    return {
      state: () => value,
      setState: (newValue: AppState) => {
        value = newValue;
      },
    };
  }

  const { state, setState } = getFakeState(initialState);
  const estimates = () => A.createEstimatesActions(state(), updateState);
  const invoices = () => A.createInvoicesActions(state(), updateState);

  // State update helper
  const updateState = (value: Partial<AppState>) => {
    const newState = { ...state(), ...value };
    setState(newState); // update state
  };

  // Generate Customers
  const customers = () => A.createCustomersActions(state(), updateState);
  const demoCustomers = fake.names.map((name) =>
    customers().add({
      name,
      phone: createPhoneNumber(),
    }),
  );

  // Generate Items
  const items = () => A.createItemsActions(state(), updateState);
  fake.products.forEach((name) =>
    items().add({
      name,
      price: getRandomInt(1, 100),
    }),
  );

  const dateRange = { start: subDays(new Date(), 5), end: new Date() };
  const rangeDays = eachDayOfInterval(dateRange);

  rangeDays.forEach((day) => {
    const itemsList = state().items;
    const customersList = state().customers;
    const estimatesList = state().estimates;
    const itemsCount = itemsList.length - 1;

    // Create fake estimates
    for (let i = 1; i < getRandomInt(1, 3); i += 1) {
      // Selecting a random number of items
      const itemIds = Array.from({ length: getRandomInt(1, itemsCount) }, () => getRandomInt(0, itemsCount));

      const estimate = estimates().calculate({
        customerId: customersList[getRandomInt(0, customersList.length - 1)].id,
        estimateDate: day,
        estimateNumber: `EST-00000${estimatesList.length}`,
        expiryDate: addDays(day, getRandomInt(0, 30)),
      });

      const createdEstimate = estimates().update(estimate);
      if (!createdEstimate) return null;

      itemIds.forEach((itemId) => {
        const { price, unit, id } = itemsList[itemId];
        estimates().addItem(
          {
            price,
            unit,
            itemId: id,
            quantity: getRandomInt(1, 3),
          },
          createdEstimate.id,
        );
      });
    }

    // Create fake invoices
    for (let i = 1; i < getRandomInt(1, 3); i += 1) {
      // Selecting a random number of items
      const itemIds = Array.from({ length: getRandomInt(1, itemsCount) }, () => getRandomInt(0, itemsCount));

      const createdInvoice = invoices().add({
        customerId: customersList[getRandomInt(0, customersList.length - 1)].id,
        invoiceDate: day,
        invoiceNumber: `INV-00000${estimatesList.length}`,
        dueDate: addDays(day, getRandomInt(0, 30)),
      });

      itemIds.forEach((itemId) => {
        const { price, unit, id } = itemsList[itemId];
        invoices().addItem(
          {
            price,
            unit,
            itemId: id,
            quantity: getRandomInt(1, 3),
          },
          createdInvoice.id,
        );
      });
    }
  });

  // Generate Payments
  const payments = () => A.createPaymentsActions(state(), updateState);
  demoCustomers.forEach((customer, index) =>
    payments().add({
      paymentDate: getTimestamp(),
      amount: getRandomInt(1, 100),
      customerId: customer.id,
      paymentNumber: `PAY-00000${index}`,
      paymentMode: 'Bank Transfer',
    }),
  );

  // Generate Expenses
  const expenses = () => A.createExpensesActions(state(), updateState);
  demoCustomers.forEach((customer) =>
    expenses().add({
      amount: getRandomInt(1, 100),
      expenseCategory: fake.expenseCategories[getRandomInt(0, fake.expenseCategories.length - 1)],
      expenseDate: getTimestamp(),
      customerId: customer.id,
    }),
  );

  // Generate Taxes
  const taxes = () => A.createTaxesActions(state(), updateState);
  taxes().add({
    name: 'State income tax',
    collectiveTax: true,
    percent: 2,
  });

  return state();
}
