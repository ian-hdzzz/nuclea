// eslint-disable-next-line no-undef
const db = require('../util/database');

// eslint-disable-next-line no-undef
module.exports = class Report {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nombre, fecha,) {
        this.nombre = nombre;
        this.fecha = fecha;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            'INSERT INTO DiasFeriados (Nombre_asueto, Fecha_asueto) VALUES (?, ?)',
            [this.nombre, this.fecha]
        );
        
    }

     static delete(idDiaFeriado){
                return db.execute(`
                    DELETE FROM DiasFeriados WHERE idDiaFeriado = ?;
                `,[idDiaFeriado])
            }
    

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM DiasFeriados');
    }

    static activosSemestre(fechaSeisMeses, fechaActual) {
        return db.execute(
            `WITH RECURSIVE calendar AS (
                SELECT ? AS date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 MONTH)
                FROM calendar
                WHERE date < ?
            )
            SELECT 
                MONTH(c.date) as mes,
                YEAR(c.date) as año,
                'activo' AS estado,
                COUNT(u.idUsuario) as cantidad
            FROM calendar c
            LEFT JOIN Usuarios u ON 
                MONTH(u.fecha_inicio_colab) = MONTH(c.date) 
                AND YEAR(u.fecha_inicio_colab) = YEAR(c.date)
                AND u.estatus = 1
            GROUP BY c.date
            ORDER BY c.date;`,
            [fechaSeisMeses, fechaActual]
        );
    }

    static inactivosSemestre(fechaSeisMeses, fechaActual) {
        return db.execute(
            `WITH RECURSIVE calendar AS (
                SELECT ? AS date
                UNION ALL
                SELECT DATE_ADD(date, INTERVAL 1 MONTH)
                FROM calendar
                WHERE date < ?
            )
            SELECT 
                MONTH(c.date) as mes,
                YEAR(c.date) as año,
                'inactivo' AS estado,
                COUNT(u.idUsuario) as cantidad
            FROM calendar c
            LEFT JOIN Usuarios u ON 
                MONTH(COALESCE(u.fecha_vencimiento_colab, u.fecha_inicio_colab)) = MONTH(c.date)
                AND YEAR(COALESCE(u.fecha_vencimiento_colab, u.fecha_inicio_colab)) = YEAR(c.date)
                AND u.estatus = 0
            GROUP BY c.date
            ORDER BY c.date;`,
            [fechaSeisMeses, fechaActual]
        );
    }

    static fetchAoYear(year){
        return db.execute(
          `SELECT COUNT(*) AS cantidad
           FROM Faltas_administrativas
           WHERE YEAR(Fecha_asignacion_falta) = ?;`,
          [year]
        );
      }



    static fetchUsersInactive() {
        return db.execute(`
            SELECT COUNT(*) AS cantidad
            FROM Usuarios
            WHERE estatus = 0
        `);
    }
    static usuariosPrevios(fechaSeisMeses){
        return db.execute(`
            SELECT COUNT(*) AS 'total'
            FROM Usuarios
            WHERE Fecha_inicio_colab < ?
            AND estatus= 1;`,[fechaSeisMeses])
    }

    static fetchUsersActive() {
        return db.execute(`
            SELECT COUNT(*) AS cantidad
            FROM Usuarios
            WHERE estatus = 1
        `);
    }

    static Update(idDF, name, date) {
        return db.execute(
            `UPDATE DiasFeriados 
             SET Nombre_asueto = ?, Fecha_asueto = ?
             WHERE idDiaferiado = ?`,
            [name, date, idDF]
        );
    }
    
    static search(name) {
        if (name) {
            // Búsqueda con filtro
            return db.execute(
                'SELECT * FROM DiasFeriados WHERE Nombre_asueto LIKE ?', 
                [`%${name}%`]
            );
        } else {
            return db.execute('SELECT * FROM DiasFeriados'); 
        }
    }
}

