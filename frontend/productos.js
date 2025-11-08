const form = document.getElementById('formProducto');
const mensaje = document.getElementById('mensaje');
const tbody = document.querySelector('#tablaProductos tbody');

async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos');
    const productos = await res.json();

    tbody.innerHTML = '';
    productos.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.idProducto}</td>
          <td>${p.nombre}</td>
          <td>${p.codigo}</td>
          <td>$${parseFloat(p.precio).toFixed(2)}</td>
          <td>${p.stockDisponible}</td>
          <td>${p.idCategoria || '-'}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="editarProducto(${p.idProducto})">✏️</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.idProducto})">🗑️</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger">Error al cargar productos</td></tr>`;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = 'Procesando...';

  const producto = {
    nombre: document.getElementById('nombre').value,
    codigo: document.getElementById('codigo').value,
    precio: parseFloat(document.getElementById('precio').value),
    stockDisponible: parseInt(document.getElementById('stockDisponible').value),
    idCategoria: parseInt(document.getElementById('idCategoria').value) || null
  };

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    const data = await res.json();

    if (res.ok) {
      mensaje.className = 'text-success fw-bold';
      mensaje.textContent = '✅ Producto guardado correctamente';
      form.reset();
      cargarProductos();
    } else {
      mensaje.className = 'text-danger fw-bold';
      mensaje.textContent = data.error || '❌ Error al guardar el producto';
    }
  } catch (err) {
    mensaje.className = 'text-danger fw-bold';
    mensaje.textContent = '❌ Error al conectar con el servidor.';
  }
});

// 🟢 Editar producto
async function editarProducto(id) {
  const fila = [...tbody.children].find(tr => tr.children[0].textContent == id);
  if (!fila) return;

  const nombre = fila.children[1].textContent;
  const codigo = fila.children[2].textContent;
  const precio = parseFloat(fila.children[3].textContent.replace('$', ''));
  const stockDisponible = parseInt(fila.children[4].textContent);
  const idCategoria = fila.children[5].textContent;

  document.getElementById('nombre').value = nombre;
  document.getElementById('codigo').value = codigo;
  document.getElementById('precio').value = precio;
  document.getElementById('stockDisponible').value = stockDisponible;
  document.getElementById('idCategoria').value = idCategoria;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const actualizado = {
      nombre: document.getElementById('nombre').value,
      codigo: document.getElementById('codigo').value,
      precio: parseFloat(document.getElementById('precio').value),
      stockDisponible: parseInt(document.getElementById('stockDisponible').value),
      idCategoria: parseInt(document.getElementById('idCategoria').value) || null
    };

    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });

      if (res.ok) {
        mensaje.className = 'text-success fw-bold';
        mensaje.textContent = '✅ Producto actualizado correctamente';
        form.reset();
        cargarProductos();
        form.onsubmit = defaultSubmit; // restaurar comportamiento
      } else {
        mensaje.className = 'text-danger fw-bold';
        mensaje.textContent = '❌ Error al actualizar producto';
      }
    } catch {
      mensaje.className = 'text-danger fw-bold';
      mensaje.textContent = '❌ Error al conectar con el servidor.';
    }
  };
}

// 🔴 Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      mensaje.className = 'text-success fw-bold';
      mensaje.textContent = '✅ Producto eliminado correctamente';
      cargarProductos();
    } else {
      mensaje.className = 'text-danger fw-bold';
      mensaje.textContent = '❌ Error al eliminar producto';
    }
  } catch {
    mensaje.className = 'text-danger fw-bold';
    mensaje.textContent = '❌ Error al conectar con el servidor.';
  }
}

const defaultSubmit = form.onsubmit;
cargarProductos();
