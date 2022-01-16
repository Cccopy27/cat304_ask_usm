import styles from "./Signup.module.css";

import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, username);
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
      </form>
    </div>
  )
}