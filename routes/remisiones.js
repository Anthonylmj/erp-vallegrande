const express = require('express');
const router = express.Router();
const { Remision, Cliente, DetalleRemision, Producto } = require('../models');

// ✅ Crear una nueva remisión

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

    res.status(201).json({
      message: 'Remisión creada correctamente',
      numeroRemision: nuevaRemision.idRemision
    });

  } catch (error) {
    console.error('❌ Error al crear remisión:', error);
    res.status(500).json({ error: 'Error al registrar la remisión' });
  }
});

// ✅ Listar remisiones
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
