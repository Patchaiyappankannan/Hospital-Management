import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedPage = ({ allowedRoles, children }) => {
  const userRole = localStorage.getItem('role');

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedPage;
