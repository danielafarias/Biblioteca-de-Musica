const Sequelize = require("sequelize");
const sequelize = require("../database");

const Gender = sequelize.define("genders", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false, 
    createdAt: false,
    updatedAt: false,
  });
  
  module.exports = Gender;