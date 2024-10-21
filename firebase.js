import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "268818d170efc85101bd36c277f699621ee52ca7",
  authDomain: "eventmate-8756a.firebaseapp.com",
  projectId: "eventmate-8756a",
  storageBucket: "eventmate-8756a.appspot.com",
  messagingSenderId: "97275633702",
  appId: "1:97275633702:android:4f1af63f79d8fda62a46e7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
