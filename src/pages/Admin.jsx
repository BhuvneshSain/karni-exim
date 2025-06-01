import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AdminLogin from '../components/AdminLogin';
import ProductForm from '../components/ProductForm';

const Admin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <AdminLogin onLogin={() => {}} />;

  return <ProductForm />;
};

export default Admin;
