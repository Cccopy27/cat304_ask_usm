import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

// firebase imports
import { db, auth } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc} from "firebase/firestore";
import Swal from "sweetalert2";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, username) => {
    setError(null)
    setIsPending(true)
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)

      if (!res) {
        throw new Error('Could not create new account');
      }

      const docRef = doc(db, 'users', auth.currentUser.uid)
      updateProfile(auth.currentUser, { displayName: username });
      setDoc((docRef), { displayName: username });
      // dispatch({ type: 'LOGIN', payload: res.user });

        if (!isCancelled) {
          setIsPending(false)
          setError(null)
        }
    }
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, isPending, error };
}