const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');
const { body, validationResult } = require('express-validator');

// ✅ Crear cliente
router.post(
  '/',
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('identificacion').notEmpty().withMessage('La identificación es obligatoria'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const cliente = await Cliente.create(req.body);
      res.status(201).json({ message: 'Cliente creado correctamente', cliente });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// ✅ Listar clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
