const db = require("../util/database");
const Usuario = require('../models/usuario.model');

exports.getDashboardInfo = async (req, res, next) => {
    try {
        const [acts] = await db.query(`
            SELECT 
            MONTH(fecha_inicio_colab) AS mes,
            'activo' AS estado,
            COUNT(*) AS cantidad
            FROM Usuarios
            WHERE estatus = 1
            GROUP BY mes
          `);

          const [inacts] = await db.query(`
            SELECT 
            MONTH(fecha_vencimiento_colab) AS mes,
            'inactivo' AS estado,
            COUNT(*) AS cantidad
            FROM Usuarios
            WHERE estatus = 0 AND fecha_vencimiento_colab IS NOT NULL
            GROUP BY mes

            ORDER BY mes;
          `);
          // Inicializar los arrays para 12 meses
        const activos = Array(12).fill(0);
        const inactivos = Array(12).fill(0);


        acts.forEach(row => {
            const mesIndex = row.mes - 1; // enero = 0
            activos[mesIndex] = row.cantidad;
          });
          
      
        inacts.forEach(row => {
            const mesIndex = row.mes - 1; 
            inactivos[mesIndex] = row.cantidad;
        });


        //poner despuesconst nousers = rows.length === 0;

        const mensaje = req.session.info || '';
        if (req.session.info) {
            req.session.info = '';
        }

        const mensajeError = req.session.errorUsu || '';
        if (req.session.errorUsu) {
            req.session.errorUsu = '';
        }

        res.render('../views/pages/reports.hbs', {
            activosPorMes: JSON.stringify(activos),
            inactivosPorMes: JSON.stringify(inactivos),
            csrfToken: req.csrfToken(),
            info: mensaje,
            error: mensajeError,
            title: 'Users',
        }
    );
    } catch (err) {
        console.error('Error en get_users:', err);
        res.status(500).send('Internal Server Error');
    }
};