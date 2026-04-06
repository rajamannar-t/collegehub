import { initializeApp } from 'firebase/app';
import { getAuth }        from 'firebase/auth';
import { getFirestore }   from 'firebase/firestore';
import { getFunctions }   from 'firebase/functions';

const firebaseConfig = {
  apiKey:            "AIzaSyBq34sFtzvNSMVsXRnGZREW_F0iuGl52yI",
  authDomain:        "collegehub-2f811.firebaseapp.com",
  projectId:         "collegehub-2f811",
 storageBucket: "collegehub-2f811.appspot.com",
  messagingSenderId: "633391123008",
  appId:             "1:633391123008:web:a5983010ad3ce6b340ada5",
};

const app = initializeApp(firebaseConfig);

export const auth      = getAuth(app);
export const db        = getFirestore(app);
export const functions = getFunctions(app);
