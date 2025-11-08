const form = document.getElementById('formRemision');
const mensaje = document.getElementById('mensaje');
const selectCliente = document.getElementById('selectCliente');
const tbodyProductos = document.querySelector('#tablaProductos tbody');
const tbodyRemisiones = document.querySelector('#tablaRemisiones tbody');

// 🚀 Cargar lista de clientes
async function cargarClientes() {
  try {
    const res = await fetch('http://localhost:3000/api/clientes');
    const clientes = await res.json();
    selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
    clientes.forEach(c => {
      selectCliente.innerHTML += `<option value="${c.idCliente}">${c.nombre} (${c.identificacion})</option>`;
    });
  } catch {
    selectCliente.innerHTML = '<option value="">Error al cargar clientes</option>';
  }
}

// 🚀 Cargar productos en tiempo real
async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos');
    const productos = await res.json();
    tbodyProductos.innerHTML = '';

    productos.forEach(p => {
      tbodyProductos.innerHTML += `
        <tr>
          <td><input type="checkbox" class="chkProducto" data-id="${p.idProducto}"></td>
          <td>${p.nombre}</td>
          <td>$${parseFloat(p.precio).toFixed(2)}</td>
          <td>${p.stockDisponible}</td>
          <td><input type="number" class="form-control form-control-sm cantidad" data-id="${p.idProducto}" min="1" max="${p.stockDisponible}" disabled></td>
        </tr>
      `;
    });

    // Activar/desactivar input cantidad
    document.querySelectorAll('.chkProducto').forEach(chk => {
      chk.addEventListener('change', () => {
        const inputCantidad = document.querySelector(`.cantidad[data-id="${chk.dataset.id}"]`);
        inputCantidad.disabled = !chk.checked;
        inputCantidad.value = chk.checked ? 1 : '';
      });
    });

  } catch {
    tbodyProductos.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar productos</td></tr>';
  }
}

// ✅ Cargar remisiones en tabla
async function cargarRemisiones() {
  try {
    const res = await fetch('http://localhost:3000/api/remisiones');
    const remisiones = await res.json();
    tbodyRemisiones.innerHTML = '';

    remisiones.forEach(r => {
      // Convertir fecha a hora local Colombia
      const fechaLocal = new Date(r.fechaEmision + 'Z').toLocaleDateString('es-CO', {
        timeZone: 'America/Bogota',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Traducir estado
      const estadoMostrar = r.estado === 'PENDIENTE' ? 'EMITIDA' : r.estado;

      tbodyRemisiones.innerHTML += `
        <tr>
          <td>${r.idRemision}</td>
          <td>${r.Cliente ? r.Cliente.nombre : 'Sin cliente'}</td>
          <td>${fechaLocal}</td>
          <td>${estadoMostrar}</td>
          <td>
            <a href="http://localhost:3000/api/pdf/${r.idRemision}" target="_blank" class="btn btn-sm btn-danger">
              📄 PDF
            </a>
          </td>
        </tr>
      `;
    });
  } catch {
    tbodyRemisiones.innerHTML = '<tr><td colspan="5" class="text-danger">Error al cargar remisiones</td></tr>';
  }
}

// 📦 Enviar remisión
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = 'Procesando...';
  mensaje.className = '';

  const seleccionados = [];
  document.querySelectorAll('.chkProducto:checked').forEach(chk => {
    const id = parseInt(chk.dataset.id);
    const cantidadInput = document.querySelector(`.cantidad[data-id="${id}"]`);
    const cantidad = parseInt(cantidadInput.value);
    if (cantidad > 0) seleccionados.push({ idProducto: id, cantidad });
  });

  if (seleccionados.length === 0) {
    mensaje.className = 'text-danger';
    mensaje.textContent = '❌ Debes seleccionar al menos un producto.';
    return;
  }

  const body = {
    idCliente: parseInt(selectCliente.value),
    productos: seleccionados,
    observaciones: document.getElementById('observaciones').value,
    creadoPor: 1
  };

  try {
    const res = await fetch('http://localhost:3000/api/remisiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.className = 'text-success';
      mensaje.textContent = `✅ ${data.message} (Remisión N° ${data.numeroRemision})`;
      form.reset();
      await cargarProductos();   // Refresca stock
      await cargarRemisiones();  // Actualiza lista de remisiones
    } else {
      mensaje.className = 'text-danger';
      mensaje.textContent = `❌ ${data.error || 'Error desconocido'}`;
    }
  } catch {
    mensaje.className = 'text-danger';
    mensaje.textContent = '❌ Error al conectar con el servidor.';
  }
});

// Inicializar
cargarClientes();
cargarProductos();
cargarRemisiones();
