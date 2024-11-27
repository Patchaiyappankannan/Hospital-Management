const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User} = require('../models'); 
const validator = require('validator');
require('dotenv').config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

  
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
    });

    return res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during signup' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'employee') {
      if (user.access !== 1) {
        return res.status(403).json({ success: false, message: 'Access denied. Employee access level is insufficient.' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: user.role,
      id: user.id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
};



exports.protectedRoute = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};



exports.getDataByRoleAndId = async (req, res) => {
    try {
      const { id, role } = req.body; 
  
   
      if (!id || !role) {
        return res.status(400).json({ success: false, message: 'ID and role are required' });
      }
  
     
      const users = await User.findAll();
      if (!users || users.length === 0) {
        return res.status(404).json({ success: false, message: 'No users found' });
      }
  
    
      const employees = users.filter(user => user.role === 'employee');
      const admins = users.filter(user => user.role === 'admin');
  
     
      const employeeCount = employees.length;
      const adminCount = admins.length;
  
      if (role === 'admin') {
       
        const admin = await User.findOne({ where: { id, role: 'admin' } });
        if (!admin) {
          return res.status(404).json({ success: false, message: 'Admin not found' });
        }
  
        
        return res.status(200).json({
          success: true,
          message: 'Data fetched successfully',
          admin,
          employees,
          employeeCount,
          adminCount,
        });
      } else if (role === 'employee') {
       
        const employee = await User.findOne({ where: { id, role: 'employee' } });
        if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found' });
        }
  
      
        return res.status(200).json({
          success: true,
          message: 'Employee data fetched successfully',
          employee,
          employeeCount,
          adminCount,
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
  
  exports.addEmployee = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format.',
        });
      }
  
     
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use.',
        });
      }
  
     
      if (!password || password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long.',
        });
      }
  
     
      if (role !== 'employee') {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Only employees can be added.',
        });
      }
  
     
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
     
      const newEmployee = await User.create({
        name,
        email,
        password: hashedPassword, 
        role,
      });
  
      return res.status(201).json({
        success: true,
        message: 'Employee added successfully',
        employee: {
          id: newEmployee.id,
          name: newEmployee.name,
          email: newEmployee.email,
          role: newEmployee.role,
        }, 
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while adding the employee.',
      });
    }
  };

  

exports.deleteEmployee = async (req, res) => {
    try {
      const { id } = req.params; 
  
     
      const employee = await User.findOne({ where: { id, role: 'employee' } });
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }
  

      await employee.destroy();
  
      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the employee.',
      });
    }
  };


exports.updateAccess = async (req, res) => {
  try {
    const { id, access } = req.body; 
    const { role } = req.user; 

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update access levels.',
      });
    }

    if (typeof access !== 'number' || access < 0 || access > 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid access level. Must be 0 (no access), 1 (basic), or 2 (full access).',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.access = access;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Access level updated successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        access: user.access,
      },
    });
  } catch (error) {
    console.error('Error updating access:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating access level.',
    });
  }
};
  