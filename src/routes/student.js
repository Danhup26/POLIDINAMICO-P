const express = require('express');
const router = express.Router();

// Importar las funciones del controlador
const { registerStudent, obtenerEstudiantes } = require('../controllers/studentController');

// Definir la ruta POST para registrar estudiantes
router.post('/registrar-estudiantes', registerStudent);

// Ruta para obtener los estudiantes registrados
router.get('/', obtenerEstudiantes);

module.exports = router;


