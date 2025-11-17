const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { Despacho, Remision, Cliente, DetalleRemision, Producto } = require("../models");

/* ============================================================
   📌 1. Cargar remisiones disponibles para despacho
============================================================ */
router.get("/remisiones", async (req, res) => {
  try {
    const remisiones = await Remision.findAll({
      include: [{ model: Cliente }],
      order: [["idRemision", "DESC"]]
    });
    res.json(remisiones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener remisiones" });
  }
});

/* ============================================================
   📌 2. Crear un despacho
============================================================ */
router.post("/", async (req, res) => {
  try {
    const { idRemision, estado, fechaDespacho, despachadoPor, notas } = req.body;

    const despacho = await Despacho.create({
      idRemision,
      estado,
      fechaDespacho,
      despachadoPor,
      notas
    });

    res.json({ message: "Despacho registrado", despacho });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar despacho" });
  }
});

/* ============================================================
   📌 3. Historial de despachos (con filtros)
============================================================ */
router.get("/", async (req, res) => {
  const { estado, desde, hasta } = req.query;

  const filtros = {};

  if (estado) filtros.estado = estado;
  if (desde && hasta) filtros.fechaDespacho = { [Op.between]: [desde, hasta] };

  try {
    const despachos = await Despacho.findAll({
      where: filtros,
      include: [
        {
          model: Remision,
          include: [{ model: Cliente }]
        }
      ],
      order: [["idDespacho", "DESC"]]
    });

    res.json(despachos);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener despachos" });
  }
});

/* ============================================================
   📌 4. Exportar PDF del despacho
============================================================ */
router.get("/pdf/:idDespacho", async (req, res) => {
  try {
    const despacho = await Despacho.findByPk(req.params.idDespacho, {
      include: [
        {
          model: Remision,
          include: [
            { model: Cliente },
            { model: DetalleRemision, include: [Producto] }
          ]
        }
      ]
    });

    if (!despacho) return res.status(404).send("Despacho no encontrado");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.image("frontend/img/logo_vallegrande.png", 40, 40, { width: 100 });
    doc.fontSize(20).text("Comprobante de Despacho", 160, 60);

    doc.moveDown();
    doc.fontSize(14).text(`Estado: ${despacho.estado}`);
    doc.text(`Fecha despacho: ${despacho.fechaDespacho || "No registrada"}`);
    doc.text(`Despachado por: ${despacho.despachadoPor}`);
    doc.text(`Notas: ${despacho.notas}`);
    doc.moveDown();

    doc.fontSize(16).text("Cliente:");
    doc.text(`Nombre: ${despacho.Remision.Cliente.nombre}`);
    doc.text(`Identificación: ${despacho.Remision.Cliente.identificacion}`);

    doc.moveDown();
    doc.fontSize(16).text("Productos:");

    despacho.Remision.DetalleRemisions.forEach(d => {
      doc.fontSize(12).text(`• ${d.Producto.nombre} (x${d.cantidad})`);
    });

    doc.end();

  } catch (error) {
    res.status(500).send("Error al generar PDF");
  }
});

module.exports = router;
