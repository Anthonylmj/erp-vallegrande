const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// ✅ Middlewares esenciales
app.use(cors());
app.use(express.json()); // reemplaza body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Importar rutas
const clienteRoutes = require('./routes/clientes');
const productoRoutes = require('./routes/productos');
const remisionRoutes = require('./routes/remisiones');
const pdfRoutes = require('./routes/pdf');
const reporteRoutes = require('./routes/reportes');
const despachoRoutes = require('./routes/despachos');


// ✅ Montar rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/remisiones', remisionRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/pdf', pdfRoutes);
app.use("/api/despachos", despachoRoutes);


// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Sincronización de la base de datos
sequelize.sync({ alter: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada correctamente');
    const PORT = 3000;
    app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });
