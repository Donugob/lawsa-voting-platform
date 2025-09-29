// client/src/admin/components/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>LAWSA Admin</h2>
        <nav>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/voters">Manage Voters</NavLink>
          <NavLink to="/admin/candidates">Manage Candidates</NavLink>
          <NavLink to="/admin/results">View Results</NavLink>
          {/* Add more links here later, e.g., for candidates */}
        </nav>
        <button onClick={handleLogout} className="logout-button-sidebar">Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet /> {/* This is where the specific page component will be rendered */}
      </main>
    </div>
  );
}

export default AdminLayout;