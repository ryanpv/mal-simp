// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCuyl4cA3zNaLyM4qPZqOawgZ56hyW4Orc",

  authDomain: "mal-simplified.firebaseapp.com",

  projectId: "mal-simplified",

  storageBucket: "mal-simplified.appspot.com",

  messagingSenderId: "902536660610",

  appId: "1:902536660610:web:0fe39439dd7f357948569b",

  measurementId: "G-04878TTQG8"

};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)


// export default app;

// const analytics = getAnalytics(app);