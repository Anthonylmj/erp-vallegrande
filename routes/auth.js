const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Usuario = require('../models/usuario');

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Usuario.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para iniciar sesión
router.post('/login', [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await Usuario.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;