// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres' // or 'mysql', 'sqlite', 'mariadb', 'mssql'
});

module.exports = sequelize;
