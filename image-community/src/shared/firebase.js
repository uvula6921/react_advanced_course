import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7jyeMM1j2DcPl02FK8_mIq-Hn8MXL9Oo",
  authDomain: "sparta-react-f05ca.firebaseapp.com",
  projectId: "sparta-react-f05ca",
  storageBucket: "sparta-react-f05ca.appspot.com",
  messagingSenderId: "387824718666",
  appId: "1:387824718666:web:1588254195b4dce37d27b3",
  measurementId: "G-YJF8QHWTWF",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const apiKey = firebaseConfig.apiKey;

export { auth, apiKey };
