const express = require('express');
const { signup, login, protectedRoute, getDataByRoleAndId, addEmployee, deleteEmployee, updateAccess   } = require('../controllers/authController');
const checkAdmin = require('../middlewares/checkAdmin');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/getDataByRoleAndId',authenticateToken,  getDataByRoleAndId);
router.post('/add', authenticateToken, checkAdmin, addEmployee);
router.delete('/delete/:id', authenticateToken, checkAdmin, deleteEmployee);
router.put('/update-access', authenticateToken,checkAdmin, updateAccess);



router.get('/protected', protectedRoute, (req, res) => {
  res.json({ message: `Welcome, ${req.user.role}!` });
});

router.post('/admin-action', authenticateToken, checkAdmin, (req, res) => {
    res.json({ message: 'Admin action performed successfully.' });
});

module.exports = router;

