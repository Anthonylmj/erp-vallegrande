const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('erp_vallegrande', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;