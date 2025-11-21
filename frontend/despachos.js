const selectRemision = document.getElementById("selectRemision");
const btnCargar = document.getElementById("btnCargar");
const cardInfo = document.getElementById("cardInfo");
const cardDespacho = document.getElementById("cardDespacho");

const infoCliente = document.getElementById("infoCliente");
const infoIdentificacion = document.getElementById("infoIdentificacion");
const infoObs = document.getElementById("infoObs");
const listaProductos = document.getElementById("listaProductos");

const estado = document.getElementById("estado");
const despachoPor = document.getElementById("despachadoPor");
const fechaDespacho = document.getElementById("fechaDespacho");
const notas = document.getElementById("notas");
const btnGuardarDespacho = document.getElementById("btnGuardarDespacho");

const tabla = document.querySelector("#tablaDespachos tbody");

/* ============================================================
   1. Cargar remisiones
============================================================ */
async function cargarRemisiones() {
  const res = await fetch("http://localhost:3000/api/despachos/remisiones");
  const data = await res.json();

  selectRemision.innerHTML = `<option value="">Seleccione</option>`;

  data.forEach(r => {
    selectRemision.innerHTML += `
      <option value="${r.idRemision}">Remisión #${r.idRemision} - ${r.Cliente.nombre}</option>
    `;
  });
}

/* ============================================================
   2. Cargar información
============================================================ */
btnCargar.addEventListener("click", async () => {
  if (!selectRemision.value) return;

  const res = await fetch("http://localhost:3000/api/remisiones"); 
  const remisiones = await res.json();

  const rem = remisiones.find(r => r.idRemision == selectRemision.value);

  if (!rem) return alert("No se encontró información");

  cardInfo.classList.remove("d-none");
  cardDespacho.classList.remove("d-none");

  infoCliente.textContent = rem.Cliente.nombre;
  infoIdentificacion.textContent = rem.Cliente.identificacion;
  infoObs.textContent = rem.observaciones || "N/A";

  listaProductos.innerHTML = "";
  rem.DetalleRemisions.forEach(d => {
    listaProductos.innerHTML += `<li>${d.Producto.nombre} (x${d.cantidad})</li>`;
  });
});

/* ============================================================
   3. Guardar despacho
============================================================ */
btnGuardarDespacho.addEventListener("click", async () => {

  const payload = {
    idRemision: selectRemision.value,
    estado: estado.value,
    fechaDespacho: fechaDespacho.value,
    despachadoPor: despachoPor.value,
    notas: notas.value
  };

  const res = await fetch("http://localhost:3000/api/despachos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    alert("Despacho registrado");
    cargarHistorial();
  }
});

/* ============================================================
   4. Cargar histórico
============================================================ */
async function cargarHistorial() {
  const res = await fetch("http://localhost:3000/api/despachos");
  const data = await res.json();

  tabla.innerHTML = "";

  data.forEach(d => {
    let badge = `<span class="badge bg-secondary">${d.estado}</span>`;
    if (d.estado === "Pendiente") badge = `<span class="badge bg-warning text-dark">Pendiente</span>`;
    if (d.estado === "En camino") badge = `<span class="badge bg-primary">En camino</span>`;
    if (d.estado === "Entregado") badge = `<span class="badge bg-success">Entregado</span>`;

    tabla.innerHTML += `
      <tr>
        <td>${d.idDespacho}</td>
        <td>${d.idRemision}</td>
        <td>${d.Remision.Cliente.nombre}</td>
        <td>${badge}</td>
        <td>${d.fechaDespacho ? new Date(d.fechaDespacho).toLocaleDateString() : "-"}</td>
        <td>${d.despachadoPor || "-"}</td>
      </tr>
    `;
  });
}

/* Inicializar */
cargarRemisiones();
cargarHistorial();
