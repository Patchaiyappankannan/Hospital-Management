const sequelize = require('../config/config');
const User = require('./user');


sequelize.sync({ force: false }) 
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error(err));

module.exports = { sequelize, User };
