import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddEmployee = ({ show, onClose, onAddEmployee }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const length = /^(?=.{8,})/; 
    const upperCase = /[A-Z]/; 
    const lowerCase = /[a-z]/; 
    const number = /\d/;
    const specialChar = /[@$!%*?&]/; 
    if (!length.test(password)) {
      return "Password must be at least 8 characters long.";
    }
    if (!upperCase.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!lowerCase.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!number.test(password)) {
      return "Password must include at least one number.";
    }
    if (!specialChar.test(password)) {
      return "Password must include at least one special character.";
    }
    return null; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!employeeData.name) {
      newErrors.name = 'Name is required.';
    }

    if (!employeeData.email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(employeeData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!employeeData.password) {
      newErrors.password = 'Password is required.';
    } else {
      const passwordError = validatePassword(employeeData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!employeeData.role) {
      newErrors.role = 'Role is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/add',
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onAddEmployee(response.data.employee);
        onClose();
      } else {
        setErrors({ form: response.data.message || 'Error adding employee.' });
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={employeeData.name}
              onChange={handleChange}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={employeeData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="form-group position-relative">
            <label>Password</label>
            <div className="input-group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                className="form-control"
                value={employeeData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="input-group-text"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-control"
              value={employeeData.role}
              onChange={handleChange}
            >
              <option value="">Select a role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <small className="text-danger">{errors.role}</small>}
          </div>

          <button type="submit" className="btn btn-primary mt-3 w-100">
            Add Employee
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEmployee;
