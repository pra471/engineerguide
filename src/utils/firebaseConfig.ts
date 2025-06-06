// src/utils/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD5N8c_HCYJaQK57YuS56uwFBGwuxDZ9w0',
  authDomain: 'engineer-guid.firebaseapp.com',
  projectId: 'engineer-guid',
  storageBucket: 'engineer-guid.appspot.com',
  messagingSenderId: '118777023809',
  appId: '1:118777023809:web:9ea2fd34fb65069286a5c0',
  measurementId: 'G-B0S7TV0NPF',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
