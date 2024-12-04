const mysql = require('mysql2');

// Creamos la conexión directamente sin pool
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'polidinamicodb'
});

// Verificamos la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos establecida correctamente.');
    }
});

module.exports = connection;



