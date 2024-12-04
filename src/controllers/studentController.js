const connection = require('../config/database'); // Asegúrate de que la ruta sea correcta

// Función para registrar el estudiante
const registerStudent = (req, res) => {
    const { cedula, nombres, apellidos, direccion, telefono, correo, programa } = req.body;
    
    const usuario = correo.split('@')[0]; // El usuario será el correo sin el dominio
    const contrasena = cedula + nombres; // La contraseña será la combinación de cédula y nombre

    // Insertar en la tabla estudiante
    const queryStudent = `
        INSERT INTO estudiante (cedula, nombres, apellidos, direccion, telefono, correo, programa)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const valuesStudent = [cedula, nombres, apellidos, direccion, telefono, correo, programa];

    // Aquí usamos el método query directamente sobre la conexión
    connection.query(queryStudent, valuesStudent, (err, result) => {
        if (err) {
            console.error('Error al insertar estudiante:', err);
            return res.status(500).send('Error al registrar el estudiante');
        }

        const queryUser = `
            INSERT INTO usuario (cedula, usuario, contrasena, estado)
            VALUES (?, ?, ?, ?)
        `;
        const valuesUser = [cedula, usuario, contrasena, 'habilitado'];

        connection.query(queryUser, valuesUser, (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return res.status(500).send('Error al registrar el usuario');
            }

            // Enviar correo (ajustar parámetros de nodemailer)
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dani.phinno11@gmail.com',
                    pass: 'zxdl cqii xwyd ovls' // Asegúrate de manejar las credenciales de forma segura
                }
            });

            const mailOptions = {
                from: 'dani.phinno11@gmail.com',
                to: correo,
                subject: 'Bienvenido a Polidinamico',
                text: `Hola ${nombres},\n\nTu usuario es: ${usuario} y tu contraseña es: ${contrasena}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error al enviar correo:', error);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            });

            // Respuesta exitosa
            res.send('Estudiante y usuario registrados correctamente');
        });
    });
};

module.exports = { registerStudent }; // Exporta la función

