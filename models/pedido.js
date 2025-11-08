const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pedido', {
    idPedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaPedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.STRING, defaultValue: 'PENDIENTE' },
    observaciones: DataTypes.STRING,
    idCliente: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER
  }, {
    tableName: 'Pedido',
    timestamps: false
  });
};
