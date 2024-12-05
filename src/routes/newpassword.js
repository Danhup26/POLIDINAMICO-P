const express = require('express');
const router = express.Router();
const { Usuario, Estudiante } = require('../../models'); // Asegúrate de que las rutas sean correctas
const nodemailer = require('nodemailer');

// Función para generar una nueva contraseña
function generarContrasena(nombre, cedula) {
  if (!nombre || !cedula) {
    throw new Error('Nombre o cédula inválidos para generar la contraseña');
  }
  const parteNombre = nombre.slice(0, 4).toUpperCase(); // Primeros 4 caracteres del nombre
  const parteCedula = cedula.slice(-4); // Últimos 4 caracteres de la cédula
  return `${parteNombre}${parteCedula}`;
}

// Ruta para validar la cédula y restablecer contraseña
router.post('/validar-cedula', async (req, res) => {
  const { cedula } = req.body;

  try {
    // Verificar si la cédula existe en la tabla estudiante
    const estudiante = await Estudiante.findOne({ 
      where: { cedula },
      attributes: ['nombres', 'correo'] // Asegúrate de incluir el correo en el modelo
    });
    if (!estudiante) {
      return res.status(404).send('No es estudiante del Politécnico o no tiene ninguna asociación');
    }

    // Verificar si la cédula existe en la tabla usuario
    const usuario = await Usuario.findOne({ where: { cedula } });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado en el sistema');
    }

    // Generar nueva contraseña
    const nuevaContrasena = generarContrasena(estudiante.nombres, cedula);

    // Actualizar la contraseña en la tabla usuario
    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    // Configuración del correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dani.phinno11@gmail.com', // Asegúrate de configurar estas variables
        pass: 'zxdl cqii xwyd ovls',
      }
    });

// Enviar correo con la nueva contraseña
await transporter.sendMail({
    from: 'dani.phinno11@gmail.com',
    to: estudiante.correo, // Correo obtenido del estudiante
    subject: 'Restablecimiento de Contraseña POLIDINAMICO',
    text: `Hola, ${estudiante.nombres},
  
  Te informamos que tu contraseña para acceder a la plataforma POLIDINAMICO ha sido restablecida con éxito. Tu nueva contraseña es: ${nuevaContrasena}.
  
  Por razones de seguridad, te recomendamos cambiar esta contraseña una vez ingreses a tu cuenta. Si no solicitaste este cambio, por favor, contacta con el soporte técnico de inmediato.
  
  Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en comunicarte con nosotros.
  
  Saludos cordiales,
  El equipo de POLIDINAMICO`
  });
  

    res.status(200).send('Nueva contraseña generada y enviada por correo');
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send('Hubo un error, intenta más tarde.');
  }
});

module.exports = router;

