const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CategoriaProducto', {
    idCategoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombreCategoria: DataTypes.STRING,
    descripcion: DataTypes.STRING
  }, {
    tableName: 'CategoriaProducto',
    timestamps: false
  });
};
