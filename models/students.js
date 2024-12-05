// models/estudiante.js
module.exports = (sequelize, DataTypes) => {
    const Estudiante = sequelize.define('estudiante', {
      cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      nombres: {
        type: DataTypes.STRING,
        allowNull: false
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      }
    }, {
      tableName: 'estudiante', // Nombre de la tabla en la base de datos
      timestamps: false
    });
  
    return Estudiante;
  };
  