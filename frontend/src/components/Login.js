import { useState } from 'react';

// Login code taken from example warehouse project.
// Credit for this entire component goes to whomever wrote it originally.

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      

    if (res.ok) onLogin();
    else alert('Invalid credentials');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="User ID"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
