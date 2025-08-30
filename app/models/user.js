const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the relationship with URLs
User.associate = (models) => {
  User.hasMany(models.Url, {
    foreignKey: 'userId',
    as: 'urls'
  });
};

module.exports = User;
