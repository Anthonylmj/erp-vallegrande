module.exports = (sequelize, DataTypes) => {
  const Despacho = sequelize.define("Despacho", {
    idDespacho: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idRemision: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("Pendiente", "En camino", "Entregado"),
      defaultValue: "Pendiente"
    },
    fechaDespacho: {
      type: DataTypes.DATE,
      allowNull: true
    },
    despachadoPor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: "Despachos",
    timestamps: false
  });

  Despacho.associate = models => {
    Despacho.belongsTo(models.Remision, {
      foreignKey: "idRemision",
      as: "Remision"
    });
  };

  return Despacho;
};
