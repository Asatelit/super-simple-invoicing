import { Currency } from './currency';

export type Settings = {
  accountName: string;
  accountEmail: string;
  companyName: string;
  logo: string;
  addressCountry: string;
  addressState: string;
  addressCity: string;
  addressZip: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  media: string[];
  phone: string;
  website: string;
  currency: Currency;
  taxPerItem: boolean;
  estimateAutoGenerate: boolean;
  estimatePrefix: string;
  invoiceAutoGenerate: boolean;
  invoicePrefix: string;
  paymentAutoGenerate: boolean;
  paymentPrefix: string;
  carbonDateFormat: string;
  currencies: Currency[];
  dateFormats: { displayDate: string; carbonFormatValue: string; momentFormatValue: string }[];
  fiscalYear: string; // "1-12"
  fiscalYears: { key: string; value: string }[];
  languages: { code: string; name: string }[];
  momentDateFormat: string;
  selectedCurrency: string;
  selectedLanguage: string;
  timeZone: string; // "Europe/Paris"
  timeZones: { key: string; value: string }[]; // key: "(UTC-11:00) Midway", value: "Pacific/Midway"
};
