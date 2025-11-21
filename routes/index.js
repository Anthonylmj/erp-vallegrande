const express = require('express');
const router = express.Router();

router.use('/clientes', require('./clientes'));
router.use('/remisiones', require('./remisiones'));
router.use('/productos', require('./productos'));
router.use('/pdf', require('./pdfRemisiones'));


module.exports = router;
