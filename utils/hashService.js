const bcrypt = require('bcrypt');

// Función para generar un hash de la contraseña
async function hashPassword(contrasena) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);
    return hash;
}

module.exports = { hashPassword };
