import styles from "./Login.module.css";

import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  }
  
  return (
    <div>
      <h2 className={styles["login-caption"]}>Login</h2>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
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
        {!isPending && <button>Login</button>}
        {isPending && <button disabled>loading</button>}
        {error && <div>{error}</div>}
      </form>
    </div>
  )
}