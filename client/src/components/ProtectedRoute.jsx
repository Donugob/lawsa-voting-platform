// client/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { VoterContext } from '../context/VoterContext';

const ProtectedRoute = ({ children }) => {
  const { voter } = useContext(VoterContext);

  if (!voter) {
    // If there is no voter data in the context, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the voter is logged in, render the child component (e.g., the VotingPage)
  return children;
};

export default ProtectedRoute;