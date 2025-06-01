import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // Tell parent that user is logged in
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="block w-full mb-4 p-2 border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="block w-full mb-4 p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Login</button>
    </form>
  );
};

export default AdminLogin;
