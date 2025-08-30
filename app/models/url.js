const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Url = sequelize.define('Url', {
  short: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
  },
  original: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Url;
