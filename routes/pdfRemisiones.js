const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { Remision, Cliente, DetalleRemision, Producto } = require('../models');

// ✅ Generar PDF de una remisión
router.get('/:id/pdf', async (req, res) => {
  try {
    const remision = await Remision.findByPk(req.params.id, {
      include: [
        { model: Cliente },
        {
          model: DetalleRemision,
          include: [Producto]
        }
      ]
    });

    if (!remision) return res.status(404).send('Remisión no encontrada');

    // Crear documento PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=remision_${remision.idRemision}.pdf`);
    doc.pipe(res);

    // Encabezado con logo y datos de la empresa
    doc
      .image('frontend/assets/logo-vallegrande.png', 40, 40, { width: 100 })
      .fontSize(18)
      .text('ERP Vallegrande - Remisión Digital', 160, 50)
      .moveDown(2);

    // Datos generales
    doc
      .fontSize(12)
      .text(`N° Remisión: ${remision.idRemision}`)
      .text(`Fecha Emisión: ${new Date(remision.fechaEmision).toLocaleString()}`)
      .text(`Cliente: ${remision.Cliente.nombre}`)
      .text(`Identificación: ${remision.Cliente.identificacion}`)
      .text(`Dirección: ${remision.Cliente.direccion}`)
      .moveDown();

    // Tabla de productos
    doc.fontSize(14).text('Detalle de productos:', { underline: true }).moveDown(0.5);
    const productos = remision.DetalleRemisions;

    productos.forEach((d, i) => {
      doc
        .fontSize(12)
        .text(`${i + 1}. ${d.Producto.nombre} - Cantidad: ${d.cantidad} - Precio: $${d.precioUnitario}`, { indent: 20 });
    });

    doc.moveDown(2).text(`Observaciones: ${remision.observaciones || '-'}`);
    doc.moveDown(2).fontSize(10).text('Generado automáticamente por el ERP Vallegrande', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar PDF');
  }
});

module.exports = router;
