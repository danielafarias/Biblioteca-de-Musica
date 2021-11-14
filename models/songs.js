require('dotenv').config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DB_BASE, process.env.DB_USER, process.env.DB_PASS, {
  host:  process.env.DB_HOST,
  port: 5432,
  dialect: 'postgres'
});

const Song = sequelize.define("songs", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cover: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    artist: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    album: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, 
    createdAt: false,
    updatedAt: false,
  });
  
  module.exports = Song;