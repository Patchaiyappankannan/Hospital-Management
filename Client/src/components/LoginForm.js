import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    setShowPopup(false);  
    setIsLoading(true);    
  
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
  
    const validationErrors = {};
    if (!trimmedEmail) {
      validationErrors.email = 'Email is required.';
    } else if (!validateEmail(trimmedEmail)) {
      validationErrors.email = 'Please enter a valid email.';
    }
  
    if (trimmedPassword.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[a-z]/.test(trimmedPassword)) {
      validationErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[A-Z]/.test(trimmedPassword)) {
      validationErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/\d/.test(trimmedPassword)) {
      validationErrors.password = 'Password must contain at least one number.';
    } else if (!/[@$!%*?&]/.test(trimmedPassword)) {
      validationErrors.password = 'Password must contain at least one special character (@$!%*?&).';
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
  
    setErrors({});  
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/login`,
        { email: trimmedEmail, password: trimmedPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setIsLoading(false);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('id', response.data.id);
  
        setEmail('');
        setPassword('');
  
        if (response.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (response.data.role === 'employee') {
          navigate('/admin-dashboard');
        } else {
          alert('Unauthorized access');
        }
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
        setShowPopup(true);  
      }
    } catch (error) {
      setErrorMessage('An error occurred while logging in. Please try again later.');
      setShowPopup(true);
      setIsLoading(false);
      console.error(error);
    }
  };
  
  

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Error</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPopup(false)}
                  aria-label="Close popup"
                ></button>
              </div>
              <div className="modal-body">
                <p>{errorMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
