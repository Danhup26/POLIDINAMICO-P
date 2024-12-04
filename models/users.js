module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      cedula: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    }, {
      tableName: 'usuario', // Aquí especificamos el nombre de la tabla
      timestamps: false,
    });
  
    return Usuario;
  };
  
  
  
