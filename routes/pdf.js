const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const { Remision, Cliente, DetalleRemision, Producto } = require('../models');

// 🎨 Colores institucionales
const colores = {
  verde: '#7d8b4d',
  gris: '#333',
  grisClaro: '#777',
  fondo: '#f5f3eb'
};

router.get('/:idRemision', async (req, res) => {
  try {
    const remision = await Remision.findByPk(req.params.idRemision, {
      include: [
        { model: Cliente },
        { model: DetalleRemision, include: [Producto] }
      ]
    });

    if (!remision) return res.status(404).send('Remisión no encontrada');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    const logoPath = path.join(__dirname, '../frontend/img/logo_vallegrande.png');

    // === 🟩 ENCABEZADO ===
    try {
      doc.image(logoPath, 60, 40, { width: 60 });
    } catch (err) {
      console.warn('⚠️ No se pudo cargar el logo:', err.message);
    }

    doc
      .fontSize(16)
      .fillColor(colores.gris)
      .text('NOTA DE REMISIÓN', 0, 45, { align: 'center' })
      .fontSize(11)
      .text('ERP Vallegrande', { align: 'center' })
      .text('Sistema de Gestión Empresarial', { align: 'center' });

    // Línea bajo título
    doc.moveTo(40, 100).lineTo(555, 100).strokeColor(colores.verde).stroke();

    // === 🧾 DATOS DEL CLIENTE ===
    const cliente = remision.Cliente;
    const fecha = new Date(remision.fechaEmision).toLocaleDateString('es-CO');

    doc
      .fontSize(11)
      .fillColor('white')
      .rect(40, 110, 515, 20)
      .fill(colores.verde)
      .fillColor('white')
      .font('Helvetica-Bold')
      .text('DATOS DEL CLIENTE', 45, 115);

    // Fondo blanco para tabla
    doc.fillColor(colores.gris).rect(40, 130, 515, 60).strokeColor(colores.verde).stroke();

    doc.font('Helvetica-Bold').fillColor(colores.gris).fontSize(10);
    doc.text('Nombre:', 50, 138);
    doc.text('Dirección:', 50, 153);
    doc.text('Email:', 50, 168);

    doc.text('Fecha:', 300, 138);
    doc.text('Teléfono:', 300, 153);
    doc.text('Vendedor:', 300, 168);

    doc.font('Helvetica').fillColor(colores.grisClaro);
    doc.text(cliente?.nombre || 'No registrado', 110, 138);
    doc.text(cliente?.direccion || '-', 110, 153);
    doc.text(cliente?.email || '-', 110, 168);
    doc.text(fecha, 350, 138);
    doc.text(cliente?.telefono || '-', 370, 153);
    doc.text('ERP Vallegrande', 370, 168);

    // === 📦 TABLA DE PRODUCTOS ===
    const detalles = await DetalleRemision.findAll({
      where: { idRemision: remision.idRemision },
      include: [Producto]
    });

    let startY = 210;
    const startX = 40;

    // Cabecera verde
    doc
      .rect(startX, startY, 515, 20)
      .fill(colores.verde)
      .fillColor('white')
      .font('Helvetica-Bold')
      .fontSize(10);

    doc.text('SKU', startX + 5, startY + 5);
    doc.text('CANT.', startX + 60, startY + 5);
    doc.text('DESCRIPCIÓN', startX + 120, startY + 5);
    doc.text('PRECIO U.', startX + 340, startY + 5);
    doc.text('SUBTOTAL', startX + 440, startY + 5);

    doc.fillColor(colores.gris);
    startY += 20;

    let total = 0;
    const rowHeight = 20;

    detalles.forEach((d, i) => {
      const y = startY + i * rowHeight;
      const subtotal = d.cantidad * d.precioUnitario;
      total += subtotal;

      // Líneas de tabla
      doc.rect(startX, y, 515, rowHeight).strokeColor('#ccc').stroke();

      // Texto
      doc.font('Helvetica').fontSize(10).fillColor(colores.gris);
      doc.text(d.Producto?.codigo || '-', startX + 5, y + 5);
      doc.text(d.cantidad.toString(), startX + 70, y + 5);
      doc.text(d.Producto?.nombre || 'Producto', startX + 120, y + 5, { width: 200 });
      doc.text(`$${d.precioUnitario.toLocaleString('es-CO')}`, startX + 340, y + 5, { width: 80, align: 'right' });
      doc.text(`$${subtotal.toLocaleString('es-CO')}`, startX + 440, y + 5, { width: 90, align: 'right' });
    });

    let currentY = startY + detalles.length * rowHeight + 10;

    // === 🗒️ OBSERVACIONES ===
    doc.rect(startX, currentY, 515, 50).strokeColor(colores.verde).stroke();
    doc.rect(startX, currentY, 380, 20).fill(colores.verde).fillColor('white').text('OBSERVACIONES', startX + 5, currentY + 5);

    doc.fillColor(colores.gris).font('Helvetica').text(remision.observaciones || '-', startX + 10, currentY + 25, { width: 370 });

    // === 🧮 TOTALES ===
    const subtotal = total;
    const iva = subtotal * 0.19;
    const granTotal = subtotal + iva;

    doc.fillColor(colores.verde).rect(startX + 380, currentY, 175, 50).strokeColor(colores.verde).stroke();

    doc.font('Helvetica-Bold').fillColor('white').text('I.V.A', startX + 400, currentY + 5);
    doc.text('SUBTOTAL', startX + 400, currentY + 20);
    doc.text('TOTAL', startX + 400, currentY + 35);

    doc.font('Helvetica-Bold').fillColor('white').text(`$${iva.toLocaleString('es-CO')}`, startX + 480, currentY + 5, { align: 'right' });
    doc.text(`$${subtotal.toLocaleString('es-CO')}`, startX + 480, currentY + 20, { align: 'right' });
    doc.text(`$${granTotal.toLocaleString('es-CO')}`, startX + 480, currentY + 35, { align: 'right' });

    // === ✍️ FIRMAS ===
    doc.moveTo(80, 720).lineTo(220, 720).strokeColor(colores.grisClaro).stroke();
    doc.moveTo(360, 720).lineTo(500, 720).strokeColor(colores.grisClaro).stroke();

    doc.fontSize(10).fillColor(colores.grisClaro);
    doc.text('Firma del Cliente', 100, 725);
    doc.text('Firma del Vendedor', 380, 725);

    // === 📅 PIE DE PÁGINA ===
    const fechaGen = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
    doc.fontSize(9).fillColor(colores.grisClaro).text(`Documento generado por ERP Vallegrande - ${fechaGen}`, 50, 760, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

module.exports = router;
