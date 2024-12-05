const { Sequelize } = require('sequelize');  // Primero importamos Sequelize
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: '1234',
  database: 'polidinamicodb',
});

// Importamos y definimos el modelo Estudiante
const Estudiante = require('./students')(sequelize, Sequelize.DataTypes);

// Importar el modelo de Usuario
const Usuario = require('./users')(sequelize, Sequelize.DataTypes);

// Exportar la conexión y los modelos
module.exports = { sequelize, Usuario, Estudiante };

