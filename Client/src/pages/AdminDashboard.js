import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from '../components/EmployeeList';
import AddEmployeeModal from '../components/AddEmployee';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminAndEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
  
        const response = await axios.post(
          'http://localhost:5000/api/getDataByRoleAndId',
          { id, role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data.success) {
          if (role === 'admin') {
            setAdmin(response.data.admin);
            setEmployees(response.data.employees || []);
          } else if (role === 'employee') {
            setEmployees([response.data.employee]);
          }
        } else {
          console.error('Error fetching data', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching admin and employee data', error);
      }
    };
  
    fetchAdminAndEmployees();
  }, [role]);

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const employeeCount = employees.length;
  const adminCount = admin ? 1 : 0;

  return (
    <div className="container mt-5">
      <h1>{role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}</h1>

      {role === 'admin' && (
        <div className="row mb-3">
          <div className="col-md-6">
            <h5>Admin Count: {adminCount}</h5>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <h5>Employee Count: {employeeCount}</h5>
          </div>
        </div>
      )}

      {role === 'employee' && (
        <div className="row mb-3">
          <div className="col-md-12">
            <h5>Employee Count: {employeeCount}</h5>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add Employee
          </button>
        </div>
      )}

      {role === 'admin' && (
        <AddEmployeeModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}

      <EmployeeList admin={role === 'admin' ? admin : null} employees={employees} />

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
