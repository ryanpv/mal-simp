import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, 
    signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../Accounts/firebase';
import { useStateContext } from './StateContexts';

const AuthContext = React.createContext();
const providerGoogle = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const serverUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_DEPLOYED_SERVER : process.env.REACT_APP_SERVER_BASEURL
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState();
  const [loginAttempts, setLoginAttempts] = useState(1)
  const [userEmailStore, setUserEmailStore] = useState({ userEmailStore: ""})
  const navigate = useNavigate();
  const { setCategoryList, setErrorMessage, loading, setLoading } = useStateContext();


  function signup(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode);
        setError(errorMessage)
      });
  };

   async function login(email, password) {
    if (loginAttempts > 5 && userEmailStore === email) {
      console.log('too many login attempts');

      await fetch(`${ serverUrl }/disable-user`, { 
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userEmail: email })
      });
    } else if (userEmailStore !== email) {
      setLoginAttempts(1)
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setLoginAttempts(1)

        navigate('/')
        return userCredential.user
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('err: ', errorMessage);
        setLoginAttempts((prev) => prev + 1);
        setError(errorMessage);
      });
  };

  async function logout() {
    try {
      await fetch (`${ serverUrl }/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      setCurrentUser("");
      setCategoryList({});
      malLogout();
      navigate('/');
      
      return signOut(auth);
    } catch (err) {
      console.log('logout err: ', err);
    }
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
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // setCurrentUser(user.displayName ? user.displayName : user.email)
        await fetch(`${ serverUrl }/login-session`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ accessToken: user.accessToken, isRegUser: user.isRegUser })
        });
        setCurrentUser(user.displayName ? user.displayName : user.email);
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
    loginAttempts,
    setUserEmailStore,
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
