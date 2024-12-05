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
        subject: 'Bienvenido a la plataforma POLIDINAMICO',
        text: `Hola ${usuario},
      
      ¡Bienvenido a la plataforma POLIDINAMICO! Hemos creado una cuenta para ti, donde podrás realizar todas tus solicitudes y acciones como estudiante.
      
      Aquí tienes los detalles de tu cuenta:
      - **Usuario**: ${usuario}
      - **Contraseña**: ${contrasena}
      
      Te recomendamos cambiar tu contraseña una vez que ingreses por primera vez para mayor seguridad. Si tienes alguna pregunta o necesitas ayuda con la plataforma, no dudes en ponerte en contacto con nuestro equipo de soporte.
      
      Gracias por formar parte de POLIDINAMICO. ¡Estamos aquí para apoyarte en tu proceso académico!
      
      Saludos cordiales,  
      El equipo de POLIDINAMICO`
      };
      

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
}

module.exports = { enviarCorreo };
