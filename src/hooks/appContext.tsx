import localForage from 'localforage';
import React, { createContext, useState, useEffect } from 'react';
import {
  AppContext,
  AppState,
  AppActions,
  AppViews,
  AppHelpers,
  AppContextResponseArray,
  AppContextResponseObject,
} from '../types';
import * as A from '../actions';
import { generateDemoData } from '../demo';
import { IS_DEMO_MODE } from '../config';
import { INIT_CONTEXT, INIT_STATE } from '../assets';

const store = localForage.createInstance({ driver: localForage.INDEXEDDB });

const readContextFromLocalStorage = (initState: AppState): Promise<AppState> => {
  // get parsed state from local storage
  return store
    .getItem('state')
    .then((state) => (state ? { ...initState, ...JSON.parse(state as string) } : initState))
    .catch((err) => {
      throw new Error(`Cannot read storage data. Error: ${err}`);
    });
};

export const appContext = createContext<AppContext>(INIT_CONTEXT);

export const AppContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AppState>(INIT_STATE);

  useEffect(() => {
    (async function updateState() {
      let demoData: Partial<AppState> = {};
      // Load data to display the application in demo mode
      if (IS_DEMO_MODE) demoData = generateDemoData();
      console.info({ IS_DEMO_MODE });
      // Rehydrate the app state
      const state = await readContextFromLocalStorage(INIT_STATE);
      // Update the app state
      setState({ ...state, ...demoData, isLoading: false });
    })();
  }, []);

  const updateContext = (value: Partial<AppState>) => {
    try {
      const newState = { ...state, ...value };
      setState(newState); // update state
      store.setItem('state', JSON.stringify(newState)); // save state to local storage
    } catch (error) {
      throw new Error('Error writing data to offline storage.');
    }
  };

  const actions: AppActions = {
    customers: A.createCustomersActions(state, updateContext),
    estimates: A.createEstimatesActions(state, updateContext),
    expenses: A.createExpensesActions(state, updateContext),
    invoices: A.createInvoicesActions(state, updateContext),
    items: A.createItemsActions(state, updateContext),
    payments: A.createPaymentsActions(state, updateContext),
  };

  const views: AppViews = {
    // closedOrders: createClosedOrdersViews(state),
  };

  const helpers: AppHelpers = {
    // translation: createTranslationHelper(state, { i18n, t, dateDnsLocales, supportedLocales }),
  };

  const responseArray: AppContextResponseArray = [state, actions, views, helpers];
  const responseObject: AppContextResponseObject = { state, actions, views, helpers };

  return (
    <appContext.Provider value={Object.assign(responseArray, responseObject)}>{children}</appContext.Provider>
  );
};
