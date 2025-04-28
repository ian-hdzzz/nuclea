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
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const dd = String(today.getDate()).padStart(2, '0');
        const fechaActual = `${yyyy}-${mm}-${dd}`;

        //---------Fecha 6 meses atras------------
        const fechaSeisMesesAtras = new Date(today.setMonth(today.getMonth() - 5));
        const yyyy6 = fechaSeisMesesAtras.getFullYear();
        const mm6 = String(fechaSeisMesesAtras.getMonth() + 1).padStart(2, '0');
        const fechaSeisMeses = `${yyyy6}-${mm6}-01`;
        let mm6check = parseInt(String(fechaSeisMesesAtras.getMonth() + 1));


        console.log('Fecha actual:')
        console.log(fechaActual); // Ejemplo: 2025-04-21
        console.log('Fecha 6 meses atras:')
        console.log(fechaSeisMeses);
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ];
        let [usuariosActivos] = await Reports.activosSemestre(fechaSeisMeses, fechaActual)
        let [usuariosInactivos] = await Reports.inactivosSemestre(fechaSeisMeses, fechaActual)
        console.log(usuariosActivos)
        console.log(usuariosInactivos)
        const activosSeisMeses=[0,0,0,0,0,0];
        const inactivosSeisMeses=[0,0,0,0,0,0];
        let mesesGrafica=[];
        let cont=0;
        while (cont < 6) {
            // Buscar si hay datos para ese mes
            const encontradoAc = usuariosActivos.find(u => u.mes === mm6check);
            if (encontradoAc) {
                activosSeisMeses[cont] = encontradoAc.cantidad ?? 0;
                // Removemos el elemento encontrado del array si quieres simular un shift
                usuariosActivos = usuariosActivos.filter(u => u.mes !== mm6check);
            }
            // Buscar si hay datos para ese mes
            const encontradoIn = usuariosInactivos.find(u => u.mes === mm6check);
            if (encontradoIn) {
                inactivosSeisMeses[cont] = encontradoIn.cantidad ?? 0;
                // Removemos el elemento encontrado del array si quieres simular un shift
                usuariosInactivos = usuariosInactivos.filter(u => u.mes !== mm6check);
            }
            // Avanzamos el mes
            mesesGrafica.push(mm6check)
            mm6check++;
            if (mm6check === 13) {
                mm6check = 1; // Resetea a enero si llega a diciembre
            }
            cont++;
        }

        const nombresMeses = mesesGrafica.map((mes, index) => {
            // Si el mes es menor que el último mes, entonces pasó el año nuevo
            const año = mes < mesesGrafica[0] ? yyyy : yyyy6;
            return `${meses[mes - 1]} - ${año}`;
          });
        console.log(nombresMeses)
        console.log(activosSeisMeses);
        console.log(inactivosSeisMeses);
        const resultado = await Reports.usuariosPrevios(fechaSeisMeses);
        console.log(resultado);
        let temp =resultado[0][0].total;
        const activosTotales = activosSeisMeses.map((valor, i) => {
            const resultado = temp + valor;
            temp = resultado;  // Actualizamos 'temp' para la siguiente iteración
            return resultado;  // Retornamos el valor actualizado
        });
        console.log(activosTotales);

        const promedioActivos = activosTotales.map((valor, i) => {
            return (valor+ (valor-inactivosSeisMeses[i])) / 2;
        });
        const indice = promedioActivos.map((valor, i) => {
            if(valor==0){
                return 0;
            }

            return Math.round((inactivosSeisMeses[i]/ valor)*100);
        });
        const suma = indice.reduce((acc, val) => acc + val, 0);
        const promedioIndice = indice.length > 0 ? (suma / indice.length).toFixed(2) : "0.00";

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