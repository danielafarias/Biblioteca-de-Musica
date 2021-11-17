require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_BASE, process.env.DB_USER, process.env.DB_PASS, {
  host:  process.env.DB_HOST,
  port: 5432,
  dialect: 'postgres'
});

module.exports = sequelize;