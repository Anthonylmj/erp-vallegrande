const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Remision = sequelize.define('Remision', {
    idRemision: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fechaEmision: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'EMITIDA' // ✅ Ya no queda en “PENDIENTE”
    },
    observaciones: {
      type: DataTypes.STRING
    },
    idCliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idPedido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creadoPor: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'remisiones',
    timestamps: false
  });

  return Remision;
};
