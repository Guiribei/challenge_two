const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'root', 'peace', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;
