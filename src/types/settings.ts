import { Currency } from './currency';

export type Settings = {
  name: string;
  companyName: string;
  logo: string | null;
  addressCountry: string | null;
  addressState: string | null;
  addressCity: string | null;
  addressZip: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  email: string;
  media: [];
  phone: null | string;
  website: null | string;
  currency: Currency;
  taxPerItem: null | boolean;
  estimateAutoGenerate: boolean;
  estimatePrefix: string | null;
  invoiceAutoGenerate: boolean;
  invoicePrefix: string | null;
  paymentAutoGenerate: boolean;
  paymentPrefix: string | null;
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
