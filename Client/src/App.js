import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedPage from './pages/ProtectedPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedPage allowedRoles={['admin', 'employee']}>
              <AdminDashboard />
            </ProtectedPage>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
