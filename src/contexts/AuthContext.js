import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, 
    signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../Accounts/firebase';
import { useStateContext } from './StateContexts';

// const auth = getAuth();
const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
const AuthContext = React.createContext();
const providerGoogle = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState();
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { setCategoryList, setErrorMessage, loading, setLoading } = useStateContext();


  function signup(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode);
        setError(errorMessage)
      });
  };

  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode);
        setError(errorMessage);
      });
  };

  function logout() {
    setCurrentUser("");
    setCategoryList({});
    malLogout();
    navigate('/');
    return signOut(auth);
  };

  function resetPassword(email) {
    sendPasswordResetEmail(auth, email);
  };

  async function malLogout() {
    try {
      await fetch(`${ serverUrl }/clear-mal-cookie`, { credentials: 'include'})
      window.location.reload();
    } catch (err) {
      console.log(err);
    };
  };


  function loginWithGoogle(){
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // console.log(`user: ${ user }, token: ${ token }`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email; // email of user
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
      navigate('/');
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        // console.log('firebase token acquired');
        // console.log(user.accessToken && 'firebase token acquired');
      } else {
        setErrorMessage('No user detected. Please log in or refresh the page.');
        console.log('no user logged in');
      };
    });
    return unsubscribe;
  }, []);

  const value = {
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    setLoading,
    error,
    setError,
    currentUser,
    setCurrentUser,
  };


  return (
    <AuthContext.Provider value={ value }>
      { !loading && children }
    </AuthContext.Provider>
  );
};
