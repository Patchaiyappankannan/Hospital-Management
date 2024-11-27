import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/getDataByRoleAndId",
        { id: 1, role: "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(response.data.employees);
    } catch (error) {
      setMessage("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <AddEmployee onAdd={fetchEmployees} />
      <EmployeeList employees={employees} onDelete={fetchEmployees} />
      {message && <p className="text-danger">{message}</p>}
    </div>
  );
};

export default AdminPanel;
