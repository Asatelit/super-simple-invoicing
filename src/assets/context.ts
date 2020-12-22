import {
  AppContext,
  AppContextResponseArray,
  AppContextResponseObject,
  AppState,
  AppViews,
  AppActions,
  AppHelpers,
  Settings,
} from '../types';

export const INIT_SETTINGS: Settings = {
  name: '',
  companyName: 'My Company',
  logo: null,
  addressCountry: null,
  addressState: null,
  addressCity: null,
  addressZip: null,
  addressLine1: null,
  addressLine2: null,
  email: '',
  media: [],
  phone: null,
  website: null,
  currency: {
    createdAt: '',
    code: 'USD',
    decimalSeparator: '.',
    id: 1,
    name: 'US Dollar',
    precision: 2,
    swapCurrencySymbol: 0,
    symbol: '$',
    thousandSeparator: ',',
    updatedAt: '2020-11-11 00:00:04',
  },

  estimateAutoGenerate: true,
  estimatePrefix: 'EST',
  invoiceAutoGenerate: true,
  invoicePrefix: 'INV',
  paymentAutoGenerate: true,
  paymentPrefix: 'PAY',

  carbonDateFormat: 'd M Y',
  currencies: [
    {
      code: 'USD',
      createdAt: '2020-11-11 00:00:04',
      decimalSeparator: '.',
      id: 1,
      name: 'US Dollar',
      precision: 2,
      swapCurrencySymbol: 0,
      symbol: '$',
      thousandSeparator: ',',
      updatedAt: '2020-11-11 00:00:04',
    },
  ],
  dateFormats: [
    {
      carbonFormatValue: 'Y M d',
      displayDate: '2020 Nov 11',
      momentFormatValue: 'YYYY MMM DD',
    },
  ],
  fiscalYear: '1-12',
  fiscalYears: [
    { key: 'january-december', value: '1-12' },
    { key: 'february-january', value: '2-1' },
    { key: 'march-february', value: '3-2' },
    { key: 'april-march', value: '4-3' },
    { key: 'may-april', value: '5-4' },
    { key: 'june-may', value: '6-5' },
    { key: 'july-june', value: '7-6' },
    { key: 'august-july', value: '8-7' },
    { key: 'september-august', value: '9-8' },
    { key: 'october-september', value: '10-9' },
    { key: 'november-october', value: '11-10' },
    { key: 'december-november', value: '12-11' },
  ],
  languages: [{ code: 'en', name: 'English' }],
  momentDateFormat: '"DD MMM YYYY"',
  selectedCurrency: '3',
  selectedLanguage: 'en',
  timeZone: 'America/New_York',
  timeZones: [{ value: 'America/New_York', key: '(UTC-05:00) New York' }],

  taxPerItem: false,
};

export const INIT_STATE: AppState = {
  customers: [],
  estimates: [],
  expenses: [],
  invoices: [],
  isLoading: false,
  items: [],
  payments: [],
  taxes: [],
  settings: INIT_SETTINGS,
};

const INIT_ACTIONS = {} as AppActions;
const INIT_VIEWS = {} as AppViews;
const INIT_HELPERS = {} as AppHelpers;

const responseArray: AppContextResponseArray = [INIT_STATE, INIT_ACTIONS, INIT_VIEWS, INIT_HELPERS];

const responseObject: AppContextResponseObject = {
  state: INIT_STATE,
  actions: INIT_ACTIONS,
  views: INIT_VIEWS,
  helpers: INIT_HELPERS,
};

export const INIT_CONTEXT: AppContext = Object.assign(responseArray, responseObject);
