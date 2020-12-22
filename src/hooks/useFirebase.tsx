import { useCallback, useState, useEffect } from 'react';
import firebase from 'firebase/app';

const useFirebase = () => {
  const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => setCurrentUser(user));
    return () => {
      unsubscribe();
    };
  }, []);

  const fn = {
    signInWithEmailAndPassword: useCallback(
      (email, password) => firebase.auth().signInWithEmailAndPassword(email, password),
      [],
    ),
    createUserWithEmailAndPassword: useCallback(
      (email, password) => firebase.auth().createUserWithEmailAndPassword(email, password),
      [],
    ),
    signOut: useCallback(() => firebase.auth().signOut(), []),
  };

  return { ...fn, currentUser };
};

export { useFirebase };
