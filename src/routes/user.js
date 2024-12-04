const express = require('express');
const router = express.Router();
const { habilitarDeshabilitar, eliminarEstudiante } = require('../controllers/userController');

// Rutas para usuarios
router.post('/habilitar-deshabilitar', habilitarDeshabilitar);
router.post('/eliminar', eliminarEstudiante);

module.exports = router;
