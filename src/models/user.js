const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ultimo_login: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  telefones: {
    type: DataTypes.JSON, // ou DataTypes.ARRAY(DataTypes.STRING)
    allowNull: true,
  },
});

module.exports = User;

