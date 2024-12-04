const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const studentRoutes = require('../src/routes/student');
const app = express();
const port = 3000;
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Usar las rutas de estudiantes
app.use('/api/estudiantes', studentRoutes);

// Middleware para servir archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para recordar clave (recordarclave.html)
app.get('/recordarclave', (req, res) => {
    res.sendFile(path.join(__dirname, 'recordarclave.html'));
});

// Ruta para registrarse (registrarest.html)
app.get('/registrarest', (req, res) => {
    res.sendFile(path.join(__dirname, 'registrarest.html'));
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

