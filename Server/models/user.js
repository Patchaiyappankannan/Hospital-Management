const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM('admin', 'employee'), 
    defaultValue: 'admin',
  },
  access: {
    type: DataTypes.INTEGER,
    defaultValue: 0, 
    allowNull: false,
    comment: "Defines access level for the user (e.g., 0 = no access, 1 = basic, 2 = full access)"
  },
});

User.beforeCreate((user) => {
  if (user.role === 'admin') {
    user.access = 1; 
  } else if (user.role === 'employee') {
    user.access = 0; 
  }
});

module.exports = User;
