import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const EmployeeList = ({ admin, employees = [] }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [updatedAccess, setUpdatedAccess] = useState(0);

  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${employeeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.reload(); 
      
      setEmployeeToDelete(null);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setShowConfirmModal(false);
    }
  };

  const handleEditAccess = async () => {
    if (![0, 1, 2].includes(updatedAccess)) {
      console.error('Invalid access level');
      return;
    }

    try {
      const payload = {
        id: employeeToEdit,
        access: updatedAccess,
      };

      await axios.put(
        `http://localhost:5000/api/update-access`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.reload();

      setEmployeeToEdit(null);
      setShowAccessModal(false);
    } catch (error) {
      console.error('Error updating access level:', error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const openConfirmModal = (id) => {
    setEmployeeToDelete(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const openAccessModal = (id, currentAccess) => {
    setEmployeeToEdit(id);
    setUpdatedAccess(currentAccess);
    setShowAccessModal(true);
  };

  const closeAccessModal = () => {
    setShowAccessModal(false);
  };

  const getAccessButtonClass = (access) => {
    return access === 1 ? 'btn btn-success' : 'btn btn-danger';
  };

  const getIdFormat = (employee) => {
    if (employee.role === 'admin') {
      return `ADMIN-${employee.id}`;
    }
    return `EMP-${employee.id}`;
  };

  return (
    <div className="mt-4">
      <h3>{admin ? 'Admin & Employee List' : 'Employee List'}</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>HMS-ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Access</th>
            {admin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {admin && (
            <tr className="table-primary">
              <td>{getIdFormat(admin)}</td>
              <td>{capitalizeFirstLetter(admin.name)}</td>
              <td>{admin.email.toLowerCase()}</td>
              <td>{capitalizeFirstLetter(admin.role)}</td>
              <td>{admin.access === 1 ? 'Access Granted' : 'No Access'}</td>
              <td className="text-center">—</td>
            </tr>
          )}

          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{getIdFormat(employee)}</td>
                <td>{capitalizeFirstLetter(employee.name)}</td>
                <td>{employee.email.toLowerCase()}</td>
                <td>{capitalizeFirstLetter(employee.role)}</td>
                <td>{employee.access === 1 ? 'Access Granted' : 'No Access'}</td>
                {admin && (
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => openConfirmModal(employee.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={getAccessButtonClass(employee.access)}
                      onClick={() => openAccessModal(employee.id, employee.access)}
                    >
                      {employee.access === 1 ? 'Given Access' : 'Remove Access'}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={admin ? 6 : 5} className="text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={showConfirmModal} onHide={closeConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this employee? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAccessModal} onHide={closeAccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Access Level</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="accessLevel">
              <Form.Label>Access Level</Form.Label>
              <Form.Control
                as="select"
                value={updatedAccess}
                onChange={(e) => setUpdatedAccess(Number(e.target.value))}
              >
                <option value="0">No Access</option>
                <option value="1">Access Granted</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={closeAccessModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditAccess}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
