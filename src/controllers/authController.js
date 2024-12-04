const bcrypt = require('bcrypt');
const { Usuario } = require('../../models/index');

async function login(req, res) {
  const { usuario: userName, contrasena } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const foundUser = await Usuario.findOne({ where: { Usuario: userName } });

    if (!foundUser) {
      return res.status(400).send('Usuario no encontrado');
    }

    // Limpiar los espacios adicionales (trim) y hacer la comparación de contraseñas
    const storedPassword = foundUser.contrasena.trim(); // Eliminar espacios al final y al inicio
    const enteredPassword = contrasena.trim(); // Eliminar espacios al final y al inicio

    if (enteredPassword !== storedPassword) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Si la contraseña es correcta, proceder con el inicio de sesión
    res.status(200).send('Inicio de sesión exitoso');
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    res.status(500).send('Error en el servidor');
  }
}

module.exports = { login };
