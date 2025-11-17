const express = require('express');
const router = express.Router();
const { Remision, Cliente, DetalleRemision, Producto } = require('../models');

/* ============================================================
   🔥 FUNCIÓN: Actualizar categoría según cantidad de remisiones
============================================================ */
async function actualizarTipoCliente(idCliente) {
  try {
    // Contar remisiones del cliente
    const total = await Remision.count({ where: { idCliente } });

    let nuevoTipo = "Nuevo";

    if (total >= 10) nuevoTipo = "Antiguo";
    else if (total >= 5) nuevoTipo = "Frecuente";

    // Actualizar cliente
    await Cliente.update(
      { tipoCliente: nuevoTipo },
      { where: { idCliente } }
    );

    console.log(`✔ Tipo de cliente actualizado: Cliente ${idCliente} → ${nuevoTipo}`);

  } catch (err) {
    console.error("❌ Error actualizando tipo de cliente:", err);
  }
}

/* ============================================================
   🧾 CREAR REMISIÓN
============================================================ */
router.post('/', async (req, res) => {
  try {
    const { idCliente, productos, observaciones, creadoPor } = req.body;

    const cliente = await Cliente.findByPk(idCliente);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    const nuevaRemision = await Remision.create({
      idCliente,
      observaciones,
      creadoPor
    });

    for (const item of productos) {
      const producto = await Producto.findByPk(item.idProducto);
      if (!producto) continue;

      await DetalleRemision.create({
        idRemision: nuevaRemision.idRemision,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioUnitario: producto.precio
      });

      producto.stockDisponible = Math.max(0, producto.stockDisponible - item.cantidad);
      await producto.save();
    }

    // 🔥 ACTUALIZAR AUTOMÁTICAMENTE tipoCliente
    await actualizarTipoCliente(idCliente);

    res.status(201).json({
      message: 'Remisión creada correctamente',
      numeroRemision: nuevaRemision.idRemision
    });

  } catch (error) {
    console.error('❌ Error al crear remisión:', error);
    res.status(500).json({ error: 'Error al registrar la remisión' });
  }
});

/* ============================================================
   📋 LISTAR REMISIONES
============================================================ */
router.get('/', async (req, res) => {
  try {
    const remisiones = await Remision.findAll({
      include: [{ model: Cliente, attributes: ['nombre', 'identificacion'] }],
      order: [['idRemision', 'DESC']]
    });
    res.json(remisiones);
  } catch (error) {
    console.error('❌ Error al obtener remisiones:', error);
    res.status(500).json({ error: 'Error al obtener remisiones' });
  }
});

module.exports = router;
