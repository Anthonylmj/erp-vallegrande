const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

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

// ✅ Importación de modelos
const Cliente = require('./cliente')(sequelize);
const Producto = require('./producto')(sequelize);
const Pedido = require('./pedido')(sequelize);
const Remision = require('./remision')(sequelize);
const DetalleRemision = require('./detalleRemision')(sequelize);
const Usuario = require('./usuario')(sequelize);
const CategoriaProducto = require('./categoriaProducto')(sequelize);

//
// ======================
// 🔹 Relaciones
// ======================
//

// Cliente - Pedido
Cliente.hasMany(Pedido, { foreignKey: 'idCliente' });
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' });

// Pedido - Remisión
Pedido.hasOne(Remision, { foreignKey: 'idPedido' });
Remision.belongsTo(Pedido, { foreignKey: 'idPedido' });

// 🔹 Cliente - Remisión (⚠️ importante: antes faltaba esta relación)
Cliente.hasMany(Remision, { foreignKey: 'idCliente' });
Remision.belongsTo(Cliente, { foreignKey: 'idCliente' });

// Remisión - DetalleRemisión
Remision.hasMany(DetalleRemision, { foreignKey: 'idRemision' });
DetalleRemision.belongsTo(Remision, { foreignKey: 'idRemision' });

// Producto - DetalleRemisión
Producto.hasMany(DetalleRemision, { foreignKey: 'idProducto' });
DetalleRemision.belongsTo(Producto, { foreignKey: 'idProducto' });

// Usuario - Pedido
Usuario.hasMany(Pedido, { foreignKey: 'idUsuario' });
Pedido.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Usuario - Remisión (creadoPor)
Usuario.hasMany(Remision, { foreignKey: 'creadoPor' });
Remision.belongsTo(Usuario, { foreignKey: 'creadoPor' });

// Categoría - Producto
CategoriaProducto.hasMany(Producto, { foreignKey: 'idCategoria' });
Producto.belongsTo(CategoriaProducto, { foreignKey: 'idCategoria' });

// ======================
// 🔹 Exportación de modelos
// ======================
module.exports = {
  sequelize,
  Cliente,
  Producto,
  Pedido,
  Remision,
  DetalleRemision,
  Usuario,
  CategoriaProducto
};
