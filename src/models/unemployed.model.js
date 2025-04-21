const db = require('../util/database');

module.exports.fetchUnemployedUsers = () => {
  return db.execute(`
    SELECT Nombre, Apellidos, Correo_electronico, 
           Fecha_inicio_colab, Fecha_vencimiento_colab
    FROM Usuarios
    WHERE Estatus = 0;
  `);
};
