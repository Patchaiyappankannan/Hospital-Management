import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to the User Management System</h1>
      <p>Please log in or sign up to access your account.</p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary mx-2">
          Login
        </Link>
        <Link to="/signup" className="btn btn-secondary mx-2">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
