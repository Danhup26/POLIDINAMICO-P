const { Sequelize } = require('sequelize');  // Primero importamos Sequelize

// Inicializamos la conexión a la base de datos
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'mysql',
  username: 'root',
  password: '1234',
  database: 'polidinamicodb',
});

// Importar y definir el modelo de Usuario
const Usuario = require('./users')(sequelize, Sequelize.DataTypes);

// Exportar la conexión y los modelos
module.exports = { sequelize, Usuario };

