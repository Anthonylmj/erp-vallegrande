const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cliente', {
    idCliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
    identificacion: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING,
    tipoCliente: DataTypes.STRING
  }, {
    tableName: 'Cliente',
    timestamps: false
  });
};
