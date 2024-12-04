const { pool } = require('../config/database');

// Función para habilitar/deshabilitar un usuario
async function habilitarDeshabilitar(req, res) {
    const { usuario, estado } = req.body;
    const nuevoEstado = estado === 'habilitado' ? 'inhabilitado' : 'habilitado';

    try {
        await pool.query('UPDATE usuario SET estado = ? WHERE usuario = ?', [nuevoEstado, usuario]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al habilitar/deshabilitar el usuario');
    }
}

// Función para eliminar estudiante y su usuario asociado
async function eliminarEstudiante(req, res) {
    const { cedula } = req.body;
    
    try {
        // Eliminar primero el usuario
        await pool.query('DELETE FROM usuario WHERE cedula = ?', [cedula]);
        
        // Luego eliminar el estudiante
        await pool.query('DELETE FROM estudiante WHERE cedula = ?', [cedula]);
        
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el estudiante');
    }
}

module.exports = { habilitarDeshabilitar, eliminarEstudiante };
