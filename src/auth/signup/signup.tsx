import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useFirebase } from 'hooks';
import { Routes } from 'enums';
import { APP_NAME } from 'config';
import styles from './signup.module.css';

const googleAuthIcon = (
  <>
    <path
      d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
      fill="#4285F4"
    />
    <path
      d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
      fill="#34A853"
    />
    <path
      d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
      fill="#FBBC05"
    />
    <path
      d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
      fill="#EA4335"
    />
  </>
);

export const Signup: React.FC = () => {
  const [state, setState] = useState({ login: '', password: '' });
  const { currentUser, createUserWithEmailAndPassword } = useFirebase();

  const onChangePassword = (password: string) => {
    setState({ ...state, password });
  };

  const onChangeLogin = (login: string) => {
    setState({ ...state, login });
  };

  const onSubmit = (event: React.FormEvent) => {
    const { login, password } = state;
    createUserWithEmailAndPassword(login, password)
      .then(({ user }) => {
        console.info(user);
        if (!user) return;
        // firebaseApp.database().ref(`users/${user.uid}`).set({
        //   email: user.email,
        //   emailVerified: user.emailVerified ?? false,
        //   phoneNumber: user.phoneNumber || '',
        //   displayName: user.displayName || '',
        // });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    event.preventDefault();
  };

  if (currentUser) return <Redirect to={Routes.Dashboard} />;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h3 className="text-center mb-5">{APP_NAME}</h3>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="EmailAddress" className="form-label small">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="EmailAddress"
              onChange={(evt) => onChangeLogin(evt.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Password" className="form-label small">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="Password"
              onChange={(evt) => onChangePassword(evt.target.value)}
            />
            <div className="form-text text-muted mb-2">At least 6 characters, but longer is better.</div>
          </div>

          <div className="d-grid gap-2 my-4">
            <button type="submit" className="btn btn-primary">
              Get started
            </button>
          </div>
        </form>

        <div className={styles.divider}>
          <span className={styles.line} />
          <span className="mx-2">or</span>
          <span className={styles.line} />
        </div>

        <button className="btn btn-outline-secondary btn-lg my-4">
          <div className={styles.centered}>
            <svg viewBox="0 0 18 18" className={styles.floating}>
              {googleAuthIcon}
            </svg>
            <span className="small">Sign up with Google</span>
          </div>
        </button>

        <div className="text-center">
          <span className="mr-1">Already have an account?</span>
          <Link to={Routes.Login}>Log in now.</Link>
        </div>
      </div>
    </div>
  );
};

