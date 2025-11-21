const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Remision, Cliente, DetalleRemision, Producto } = require("../models");
const { Op } = require("sequelize");

/* ============================================================
   🔍 FUNCIÓN: Construir filtros
============================================================ */
function buildFilters({ inicio, fin, cliente }) {
  const filtros = {};

  if (inicio && fin) {
    filtros.fechaEmision = {
      [Op.between]: [`${inicio} 00:00:00`, `${fin} 23:59:59`]
    };
  }

  if (cliente) filtros.idCliente = cliente;

  return filtros;
}

/* ============================================================
   📌 FUNCIÓN: Obtener datos de ventas
============================================================ */
async function obtenerVentas(req) {
  const filtros = buildFilters(req.method === "POST" ? req.body : req.query);

  return await Remision.findAll({
    where: filtros,
    include: [
      { model: Cliente },
      { model: DetalleRemision, include: [Producto] }
    ],
    order: [["fechaEmision", "ASC"]]
  });
}

/* ============================================================
   📊 GET REPORTES — API usada por el frontend para mostrar tabla
============================================================ */
router.get("/", async (req, res) => {
  try {
    const ventas = await obtenerVentas(req);
    res.json(ventas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reportes" });
  }
});

/* ============================================================
   📄 POST — Exportar PDF con gráficos
============================================================ */
router.post("/pdf", async (req, res) => {
  try {
    const { imgVentas, imgProductos } = req.body;
    const ventas = await obtenerVentas(req);

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.pdf");

    doc.pipe(res);

    /* --------------------
       ENCABEZADO
    -------------------- */
    doc.image("frontend/img/logo_vallegrande.png", 40, 40, { width: 100 });
    doc.fontSize(24).text("Reporte de Ventas", 160, 60);
    doc.moveDown(2);

    /* --------------------
       GRÁFICO: Ventas por día
    -------------------- */
    if (imgVentas) {
      doc.fontSize(14).text("Ventas por día");
      doc.image(imgVentas, { fit: [500, 260], align: "center" });
      doc.moveDown(2);
    }




    /* --------------------
       GRÁFICO: Productos más vendidos
    -------------------- */
    if (imgProductos) {
      doc.fontSize(14).text("Productos más vendidos");
      doc.image(imgProductos, { fit: [500, 260], align: "center" });
      doc.moveDown(2);
    }

    /* --------------------
       DETALLE DE VENTAS
    -------------------- */
    doc.addPage();
    doc.fontSize(18).text("Detalle de ventas");
    doc.moveDown();

    ventas.forEach((v, i) => {
      const fecha = new Date(v.fechaEmision).toLocaleDateString("es-CO");
      const total = v.DetalleRemisions.reduce(
        (acc, d) => acc + d.cantidad * d.precioUnitario,
        0
      );

      doc.fontSize(14)
        .text(`${i + 1}. Fecha: ${fecha}`)
        .text(`Cliente: ${v.Cliente.nombre}`)
        .text(`Total: $${total.toLocaleString("es-CO")}`)
        .moveDown();

      doc.fontSize(13).text("Productos:");

      v.DetalleRemisions.forEach(d => {
        doc.text(`- ${d.Producto.nombre} (x${d.cantidad})`, { indent: 20 });
      });

      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar PDF");
  }
});


/* ============================================================
   📊 POST — Exportar Excel con gráficos
============================================================ */
router.post("/excel", async (req, res) => {
  try {
    const { imgVentas, imgProductos } = req.body;
    const ventas = await obtenerVentas(req);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte de Ventas");

    /* --------------------
       IMAGEN GRÁFICO VENTAS
    -------------------- */
    if (imgVentas) {
      const img1 = workbook.addImage({
        base64: imgVentas,
        extension: "png"
      });

      sheet.addImage(img1, {
        tl: { col: 1, row: 1 },
        ext: { width: 600, height: 260 }
      });
    }

    /* --------------------
       IMAGEN GRÁFICO PRODUCTOS
    -------------------- */
    if (imgProductos) {
      const img2 = workbook.addImage({
        base64: imgProductos,
        extension: "png"
      });

      sheet.addImage(img2, {
        tl: { col: 1, row: 20 },
        ext: { width: 600, height: 260 }
      });
    }

    /* --------------------
       TABLA
    -------------------- */
    let fila = 35;
    sheet.getRow(fila).values = ["Fecha", "Cliente", "Producto", "Cantidad", "Precio", "Total"];
    sheet.getRow(fila).font = { bold: true };

    fila++;

    ventas.forEach(v => {
      const fecha = new Date(v.fechaEmision).toLocaleDateString("es-CO");

      v.DetalleRemisions.forEach(d => {
        sheet.getRow(fila).values = [
          fecha,
          v.Cliente.nombre,
          d.Producto.nombre,
          d.cantidad,
          d.precioUnitario,
          d.cantidad * d.precioUnitario
        ];
        fila++;
      });
    });

    /* --------------------
       DESCARGA
    -------------------- */
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="reporte_ventas.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar Excel");
  }
});

module.exports = router;
