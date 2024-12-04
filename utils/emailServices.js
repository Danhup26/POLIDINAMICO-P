const nodemailer = require('nodemailer');

// Configuración del transporte para enviar correos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dani.phinno11@gmail.com',  // Tu correo
        pass: 'zxdl cqii xwyd ovls'  // Tu contraseña
    }
});

// Función para enviar correo con la contraseña
async function enviarCorreo(correo, usuario, contrasena) {
    const mailOptions = {
        from: 'dani.phinno11@gmail.com',
        to: correo,
        subject: 'Bienvenido a la plataforma',
        text: `Tu usuario es: ${usuario}\nTu contraseña es: ${contrasena}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
}

module.exports = { enviarCorreo };
