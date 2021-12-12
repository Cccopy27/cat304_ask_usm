import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBD6Z7dQ_yx8Fkuo6sZK5lJ_Dkvq8VPZeQ",
    authDomain: "cat304askusm.firebaseapp.com",
    projectId: "cat304askusm",
    storageBucket: "cat304askusm.appspot.com",
    messagingSenderId: "472310325130",
    appId: "1:472310325130:web:14e97965e6643900d03273"
  };

initializeApp(firebaseConfig);
const db = getFirestore();

export {db};