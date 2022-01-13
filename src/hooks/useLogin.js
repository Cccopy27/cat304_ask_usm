import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"

// firebase imports
import { auth } from "../firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      dispatch({ type: 'LOGIN', payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    }
    catch(err) {
      setError(err.message);
      setIsPending(false);
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error };

}