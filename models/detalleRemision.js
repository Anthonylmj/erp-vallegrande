const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleRemision = sequelize.define('DetalleRemision', {
    idDetalle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idRemision: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precioUnitario: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'detalle_remision',
    timestamps: false
  });

  return DetalleRemision;
};
