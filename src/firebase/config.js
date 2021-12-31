import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// two firestore can be used if one of them exceed quote - wenhao

// main
// const firebaseConfig = {
//   apiKey: "AIzaSyBD6Z7dQ_yx8Fkuo6sZK5lJ_Dkvq8VPZeQ",
//   authDomain: "cat304askusm.firebaseapp.com",
//   projectId: "cat304askusm",
//   storageBucket: "cat304askusm.appspot.com",
//   messagingSenderId: "472310325130",
//   appId: "1:472310325130:web:14e97965e6643900d03273"
// };

// sub
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