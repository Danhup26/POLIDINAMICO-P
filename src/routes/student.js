// src/routes/student.js
const express = require('express');
const router = express.Router();

// Importar el controlador
const { registerStudent } = require('../controllers/studentController');

// Definir la ruta POST para registrar estudiantes
router.post('/registrar-estudiantes', registerStudent);

module.exports = router;


