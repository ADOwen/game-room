import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router} from 'react-router-dom'

import { FirebaseAppProvider } from 'reactfire'

// Import the functions you need from the SDKs(Software Development Kits) you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import ProvideLayer from './ProvideLayer';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-COrx4jAWHCxVdogiBi1AXEizBUqCffM",
  authDomain: "vanguard77-capstone.firebaseapp.com",
  databaseURL: 'https://vanguard77-capstone-default-rtdb.firebaseio.com/',
  projectId: "vanguard77-capstone",
  storageBucket: "vanguard77-capstone.appspot.com",
  messagingSenderId: "281403261903",
  appId: "1:281403261903:web:8cd6df455017e36a6ec8ba",
  measurementId: "G-W50MCTWQQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FirebaseAppProvider firebaseConfig={ firebaseConfig }>
        <ProvideLayer/>
      </FirebaseAppProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

