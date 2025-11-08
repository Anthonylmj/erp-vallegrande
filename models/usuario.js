const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    idUsuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
    rol: DataTypes.STRING,
    contrasenaHash: DataTypes.STRING
  }, {
    tableName: 'Usuario',
    timestamps: false
  });
};
