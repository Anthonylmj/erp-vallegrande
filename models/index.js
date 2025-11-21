const { Sequelize, DataTypes, Op } = require("sequelize");
const config = require("../config/config").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

// =========================
//  Importación de modelos
// =========================
const Cliente = require("./cliente")(sequelize, DataTypes);
const Producto = require("./producto")(sequelize, DataTypes);
const Pedido = require("./pedido")(sequelize, DataTypes);
const Remision = require("./remision")(sequelize, DataTypes);
const DetalleRemision = require("./detalleRemision")(sequelize, DataTypes);
const Usuario = require("./usuario")(sequelize, DataTypes);
const CategoriaProducto = require("./categoriaProducto")(sequelize, DataTypes);
const Despacho = require("./despacho")(sequelize, DataTypes);

// =========================
//  Relaciones
// =========================

// Cliente → Pedido
Cliente.hasMany(Pedido, { foreignKey: "idCliente" });
Pedido.belongsTo(Cliente, { foreignKey: "idCliente" });

// Pedido → Remisión
Pedido.hasOne(Remision, { foreignKey: "idPedido" });
Remision.belongsTo(Pedido, { foreignKey: "idPedido" });

// Cliente → Remisión (IMPORTANTE)
Cliente.hasMany(Remision, { foreignKey: "idCliente" });
Remision.belongsTo(Cliente, { foreignKey: "idCliente" });

// Remisión → Detalles
Remision.hasMany(DetalleRemision, { foreignKey: "idRemision" });
DetalleRemision.belongsTo(Remision, { foreignKey: "idRemision" });

// Producto → Detalles
Producto.hasMany(DetalleRemision, { foreignKey: "idProducto" });
DetalleRemision.belongsTo(Producto, { foreignKey: "idProducto" });

// Usuario → Pedido
Usuario.hasMany(Pedido, { foreignKey: "idUsuario" });
Pedido.belongsTo(Usuario, { foreignKey: "idUsuario" });

// Usuario → Remisión
Usuario.hasMany(Remision, { foreignKey: "creadoPor" });
Remision.belongsTo(Usuario, { foreignKey: "creadoPor" });

// Categoría → Producto
CategoriaProducto.hasMany(Producto, { foreignKey: "idCategoria" });
Producto.belongsTo(CategoriaProducto, { foreignKey: "idCategoria" });

// Remisión → Despacho
Remision.hasMany(Despacho, { foreignKey: "idRemision" });
Despacho.belongsTo(Remision, { foreignKey: "idRemision" });

// =========================
//  Exportación de modelos
// =========================
module.exports = {
  sequelize,
  Op,
  Cliente,
  Producto,
  Pedido,
  Remision,
  DetalleRemision,
  Usuario,
  CategoriaProducto,
  Despacho
};
