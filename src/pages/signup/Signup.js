import styles from "./Signup.module.css";

import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import { useCollection } from "../../hooks/useCollection";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signup, isPending, error } = useSignup();
  const {document, loading, error:userNameError} = useCollection(["users"]);
  const [customErr, setCustomErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let repeat = false;
    // check username to avoid repeat
    if (userNameError) {
      setCustomErr("Something went wrong")
    }
    else{
      document.forEach (userName => {
        if (userName.displayName === username) {
          repeat = true;
        }
      })
      if (!repeat){
        signup(email, password, username);
        setCustomErr('');
        Swal.fire("Account created, please proceed to login","","success");
        navigate("/login");
      }
      else {
        setCustomErr("Username already taken, please try another username")
      }
    }
    
  }
  
  return (
    <div>
      <h2 className={styles["signup-caption"]}>Signup</h2>
      <form className={styles["signup-form"]} onSubmit={handleSubmit}>
        <label>
          <span>email:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>password:</span>
          <input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label>
          <span>username:</span>
          <input
            required
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </label>
        {!isPending && <button>Sign up</button>}
        {isPending && <button disabled>loading</button>}
        {error && <p>{error}</p>}
        {customErr && <p>{customErr}</p>}
      </form>
    </div>
  )
}