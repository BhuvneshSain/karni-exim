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
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto bg-beige rounded-lg shadow-md border border-saffron/10">
      <h2 className="text-xl font-bold mb-6 text-charcoal border-b border-saffron pb-2">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="block w-full mb-4 p-3 border border-gray/30 rounded-md focus:ring focus:ring-saffron/30 focus:border-saffron outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="block w-full mb-6 p-3 border border-gray/30 rounded-md focus:ring focus:ring-saffron/30 focus:border-saffron outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button 
        type="submit" 
        className="bg-charcoal hover:bg-charcoal-dark text-white px-6 py-2 rounded-md transition-colors duration-300 flex items-center justify-center w-full font-medium"
      >
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
