const db = require("../util/database");
const Usuario = require('../models/usuario.model');
const Reports = require('../models/reports.model');
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

          

         const [reportsDetailsInactive] = await Reports.fetchUsersInactive();
         const [reportsDetailsActive] = await Reports.fetchUsersActive();
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

        
        console.log(reportsDetailsActive);
        console.log(reportsDetailsInactive);
        //---------Fecha actual------------
        const today = new Date('2025-04-27');
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const fechaActual = `${yyyy}-${mm}-${dd}`;

        // Calculamos la fecha de 6 meses atrás
        const fechaSeisMesesAtras = new Date(today);
        fechaSeisMesesAtras.setMonth(today.getMonth() - 5);
        fechaSeisMesesAtras.setDate(1); // Primer día del mes
        const yyyy6 = fechaSeisMesesAtras.getFullYear();
        const mm6 = String(fechaSeisMesesAtras.getMonth() + 1).padStart(2, '0');
        const fechaSeisMeses = `${yyyy6}-${mm6}-01`;

        console.log('Fecha actual:', fechaActual);
        console.log('Fecha 6 meses atrás:', fechaSeisMeses);
        
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        // Crear un array de 6 fechas mensuales
        const mesesGrafica = [];
        const tempDate = new Date(fechaSeisMesesAtras);

        for (let i = 0; i < 6; i++) {
            mesesGrafica.push({
                mes: tempDate.getMonth() + 1,
                año: tempDate.getFullYear()
            });
            tempDate.setMonth(tempDate.getMonth() + 1);
        }

        let [usuariosActivos] = await Reports.activosSemestre(fechaSeisMeses, fechaActual);
        let [usuariosInactivos] = await Reports.inactivosSemestre(fechaSeisMeses, fechaActual);
        
        // Inicializar arrays con 6 meses en 0
        const activosSeisMeses = Array(6).fill(0);
        const inactivosSeisMeses = Array(6).fill(0);

        // Llenar los arrays con los datos
        mesesGrafica.forEach((fecha, index) => {
            const encontradoAc = usuariosActivos.find(u => 
                u.mes === fecha.mes && u.año === fecha.año
            );
            if (encontradoAc) {
                activosSeisMeses[index] = encontradoAc.cantidad;
            }

            const encontradoIn = usuariosInactivos.find(u => 
                u.mes === fecha.mes && u.año === fecha.año
            );
            if (encontradoIn) {
                inactivosSeisMeses[index] = encontradoIn.cantidad;
            }
        });

        const nombresMeses = mesesGrafica.map(({ mes, año }) => 
            `${meses[mes - 1]} - ${año}`
        );

        console.log('Meses de la gráfica:', nombresMeses);
        console.log('Datos activos:', activosSeisMeses);
        console.log('Datos inactivos:', inactivosSeisMeses);

        const resultado = await Reports.usuariosPrevios(fechaSeisMeses);
        let temp = resultado[0][0].total;
        
        const activosTotales = activosSeisMeses.map((valor) => {
            const resultado = temp + valor;
            temp = resultado;
            return resultado;
        });

        const promedioActivos = activosTotales.map((valor, i) => {
            return Math.max((valor + (valor - inactivosSeisMeses[i])) / 2, 0);
        });

        const indice = promedioActivos.map((valor, i) => {
            if (valor === 0) {
                return 0;
            }
            const porcentaje = Math.round((inactivosSeisMeses[i] / valor) * 100);
            return isNaN(porcentaje) ? 0 : porcentaje;
        });

        const valoresValidos = indice.filter(val => !isNaN(val));
        const suma = valoresValidos.reduce((acc, val) => acc + val, 0);
        const promedioIndice = valoresValidos.length > 0 ? 
            (suma / valoresValidos.length).toFixed(2) : "0.00";

        const [aoYear] = await Reports.fetchAoYear(yyyy);

        res.render('../views/pages/reports.hbs', {
            activosPorMes: JSON.stringify(activos),
            inactivosPorMes: JSON.stringify(inactivos),
            csrfToken: req.csrfToken(),
            info: mensaje,
            error: mensajeError,
            primedioGeneral:promedioIndice,
            mesYear: JSON.stringify(nombresMeses),
            indice: JSON.stringify(indice),
            title: 'Reports',
            iconClass: 'fa-solid fa-clipboard-list',
            reportsDetailsInactive:reportsDetailsInactive[0],
            reportsDetailsActive:reportsDetailsActive[0],
            aoYear:aoYear[0],
        }
    );
    } catch (err) {
        console.error('Error en get_users:', err);
        res.status(500).send('Internal Server Error');
    }
};