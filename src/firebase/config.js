import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJLJVMxLnae5D_pmem2Zhx0bY1QT3--b4",
  authDomain: "nddatabase-7bc34.firebaseapp.com",
  projectId: "nddatabase-7bc34",
  storageBucket: "nddatabase-7bc34.appspot.com",
  messagingSenderId: "510064777642",
  appId: "1:510064777642:web:79d757dbce464215ee33d3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage(app);


export {db,storage};