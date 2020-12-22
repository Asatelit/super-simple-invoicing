import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AppContextProvider } from './hooks';
import { Login, Signup } from './auth';
import { Routes } from './enums';
import { FIREBASE } from './config';

import App from './App';
import '@grapecity/wijmo.styles/wijmo.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: FIREBASE.apiKey,
  authDomain: FIREBASE.authDomain,
  databaseURL: FIREBASE.databaseURL,
  projectId: FIREBASE.projectId,
  storageBucket: FIREBASE.storageBucket,
  messagingSenderId: FIREBASE.messagingSenderId,
  appId: FIREBASE.appId,
  measurementId: FIREBASE.measurementId,
};

firebase.initializeApp(firebaseConfig);

const NoMatch = () => (
  <div>
    <h1>404</h1>
    Page Not Found
  </div>
);

console.info(window);

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <AppContextProvider>
      <ToastContainer position="bottom-left" limit={3} />
      <HashRouter>
        <Switch>
          <Route path={Routes.Login} component={Login} />
          <Route path={Routes.SignUp} component={Signup} />
          <Route path={Routes.Admin} component={App} />
          <Route exact path={'/'}>
            <Redirect to={Routes.Admin} />
          </Route>
          <Route path="*" render={NoMatch} />
        </Switch>
      </HashRouter>
    </AppContextProvider>
  </Suspense>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
