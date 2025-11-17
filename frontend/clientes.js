const form = document.getElementById('formCliente');
const mensaje = document.getElementById('mensaje');
const tbody = document.querySelector('#tablaClientes tbody');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = 'Procesando...';

  const cliente = {
    nombre: document.getElementById('nombre').value,
    identificacion: document.getElementById('identificacion').value,
    direccion: document.getElementById('direccion').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value
  };

  try {
    const res = await fetch('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.className = 'text-success';
      mensaje.textContent = data.message;
      form.reset();
      cargarClientes();
    } else {
      mensaje.className = 'text-danger';
      mensaje.textContent = data.error || data.errors?.[0]?.msg;
    }
  } catch (err) {
    mensaje.className = 'text-danger';
    mensaje.textContent = 'Error al conectar con el servidor.';
  }
});

async function cargarClientes() {
  try {
    const res = await fetch('http://localhost:3000/api/clientes');
    const clientes = await res.json();
    tbody.innerHTML = '';
    clientes.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.idCliente}</td>
          <td>${c.nombre}</td>
          <td>${c.identificacion}</td>
          <td>${c.direccion || ''}</td>
          <td>${c.telefono || ''}</td>
          <td>${c.email || ''}</td>
          <td>${c.tipoCliente || ''}</td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-danger text-center">Error al cargar clientes</td></tr>';
  }
}

cargarClientes();
