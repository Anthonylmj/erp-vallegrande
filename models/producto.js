const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Producto', {
    idProducto: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
    codigo: DataTypes.STRING,
    precio: DataTypes.DECIMAL(12, 2),
    stockDisponible: DataTypes.INTEGER,
    idCategoria: DataTypes.INTEGER
  }, {
    tableName: 'Producto',
    timestamps: false
  });
};
