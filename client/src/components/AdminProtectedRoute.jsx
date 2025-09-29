// client/src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // If there is no token, redirect to the admin login page
    return <Navigate to="/admin/login" />;
  }

  // If there is a token, render the child component (e.g., the Dashboard)
  return children;
};

export default AdminProtectedRoute;