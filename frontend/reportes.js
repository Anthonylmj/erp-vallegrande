const fInicio = document.getElementById("fInicio");
const fFin = document.getElementById("fFin");
const fCliente = document.getElementById("fCliente");
const btnBuscar = document.getElementById("btnBuscar");
const tbody = document.getElementById("tbodyReportes");

// Gráficos
let graficoVentas = null;
let graficoProductos = null;

// ===============================
// 🔹 Cargar clientes
// ===============================
async function cargarClientes() {
  const res = await fetch("http://localhost:3000/api/clientes");
  const clientes = await res.json();

  fCliente.innerHTML = `<option value="">Todos los clientes</option>`;
  clientes.forEach(c => {
    fCliente.innerHTML += `
      <option value="${c.idCliente}">${c.nombre}</option>
    `;
  });
}

// ===============================
// 🔹 Consultar ventas
// ===============================
async function cargarReportes() {
  const params = new URLSearchParams();

  if (fInicio.value) params.append("inicio", fInicio.value);
  if (fFin.value) params.append("fin", fFin.value);
  if (fCliente.value) params.append("cliente", fCliente.value);

  const url = `http://localhost:3000/api/reportes?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  mostrarTabla(data);
  generarGraficoVentas(data);
  generarGraficoProductos(data);
}

// ===============================
// 🔹 Mostrar tabla
// ===============================
function mostrarTabla(ventas) {
  tbody.innerHTML = "";

  ventas.forEach(v => {
    const fecha = new Date(v.fechaEmision).toLocaleDateString("es-CO");

    const total = v.DetalleRemisions.reduce(
      (acc, d) => acc + d.cantidad * d.precioUnitario,
      0
    );

    tbody.innerHTML += `
      <tr>
        <td>${fecha}</td>
        <td>${v.Cliente?.nombre || "-"}</td>
        <td>${v.DetalleRemisions.length}</td>
        <td>$${total.toLocaleString("es-CO")}</td>
      </tr>
    `;
  });
}

// ===============================
// 🔹 Gráfico: Ventas por día
// ===============================
function generarGraficoVentas(ventas) {
  const totalesPorDia = {};

  ventas.forEach(v => {
    const fecha = new Date(v.fechaEmision).toLocaleDateString("es-CO");

    const total = v.DetalleRemisions.reduce(
      (acc, d) => acc + d.cantidad * d.precioUnitario,
      0
    );

    totalesPorDia[fecha] = (totalesPorDia[fecha] || 0) + total;
  });

  const labels = Object.keys(totalesPorDia);
  const valores = Object.values(totalesPorDia);

  if (graficoVentas) graficoVentas.destroy();

  graficoVentas = new Chart(document.getElementById("graficoVentas"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Ventas por día",
        data: valores,
        borderWidth: 2
      }]
    }
  });
}

// ===============================
// 🔹 Gráfico: Productos más vendidos
// ===============================
function generarGraficoProductos(ventas) {
  const contador = {};

  ventas.forEach(v => {
    v.DetalleRemisions.forEach(d => {
      const nombre = d.Producto?.nombre || "Desconocido";
      contador[nombre] = (contador[nombre] || 0) + d.cantidad;
    });
  });

  const labels = Object.keys(contador);
  const valores = Object.values(contador);

  if (graficoProductos) graficoProductos.destroy();

  graficoProductos = new Chart(document.getElementById("graficoProductos"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Productos más vendidos",
        data: valores,
        borderWidth: 2
      }]
    }
  });
}

// ===============================
// 🔹 Exportar PDF con gráficos — SOLO ESTE
// ===============================
document.getElementById("btnPDF").addEventListener("click", async () => {

  const imgVentas = document.getElementById("graficoVentas").toDataURL("image/png");
  const imgProductos = document.getElementById("graficoProductos").toDataURL("image/png");

  const body = {
    inicio: fInicio.value,
    fin: fFin.value,
    cliente: fCliente.value,
    imgVentas,
    imgProductos
  };

  const res = await fetch("http://localhost:3000/api/reportes/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
});

// ===============================
// 🔹 Exportar Excel con gráficos
// ===============================
document.getElementById("btnExcel").addEventListener("click", async () => {

  const imgVentas = document.getElementById("graficoVentas").toDataURL("image/png");
  const imgProductos = document.getElementById("graficoProductos").toDataURL("image/png");

  const body = {
    inicio: fInicio.value,
    fin: fFin.value,
    cliente: fCliente.value,
    imgVentas,
    imgProductos
  };

  const res = await fetch("http://localhost:3000/api/reportes/excel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_ventas.xlsx";
  a.click();
});

btnBuscar.addEventListener("click", cargarReportes);

// ===============================
// 🔹 Inicializar
// ===============================
cargarClientes();
cargarReportes();
