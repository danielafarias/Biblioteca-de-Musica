const Sequelize = require("sequelize");
const database = require("../database");

const Song = database.define(
  "songs",
  {
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
    gender_id: {
      type: Sequelize.INTEGER,
      references: "genders",
      referencesKey: "id",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Song;
