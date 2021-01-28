import { AppActions, AppViews, AppState, AppHelpers } from '../types';

export type AppContextResponseArray = [
  Readonly<AppState>,
  Readonly<AppActions>,
  Readonly<AppViews>,
  Readonly<AppHelpers>
];

export type AppContextResponseObject = {
  state: Readonly<AppState>;
  actions: Readonly<AppActions>;
  views: Readonly<AppViews>;
  helpers: Readonly<AppHelpers>;
};

export type AppContext = AppContextResponseArray & AppContextResponseObject;

export type UpdateState = (props: Partial<AppState>) => void;

export type Action<S> = (state: AppState, setState: UpdateState) => S;

export type View<S> = (state: AppState) => S;

/** Make only some properties optional */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type DateRange = { start: Date; end: Date };

export type DataCollection<T> = { [key: string]: T };

export type SummaryData = {
  month?: string;
  sales: number;
  receipts: number;
  expenses: number;
  netIncome: number;
};
