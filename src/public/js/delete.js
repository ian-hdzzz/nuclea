import { formatDate } from '../../lib/helpers';
function confirmDeleteReq(idSolicitud) {
    console.log("------------Esta es el id solicitud----------");
    console.log(idSolicitud);
    const confirmed = confirm("Are you sure you want to delete this request?");
    if (confirmed) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


        fetch(`/nuclea/request/delete/${idSolicitud}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken // **Usa el token leído del meta tag**
            },
            credentials: 'include' // Asegúrate de incluir las credenciales (cookies) si es necesario
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            let html_container = `
                <table>
                    <thead>
                        <tr>
                            <th>Request of</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th class="descripcion-columna">Description</th>
                            <th>Leader Approval</th>
                            <th>Admin Approval</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;

            if(data && data.datos && data.datos.length > 0){
                data.datos.forEach(item => {
                    const leaderStatusClass = item.Aprobacion_L === 'Aprobado' ? 'active' : 
                                            item.Aprobacion_L === 'Rechazado' ? 'inactive' : 'pending';
                    const leaderStatusText = item.Aprobacion_L === 'Aprobado' ? 'Approved' : 
                                        item.Aprobacion_L === 'Rechazado' ? 'Rejected' : 'Pending';
                    
                    const adminStatusClass = item.Aprobacion_A === 'Aprobado' ? 'active' : 
                                        item.Aprobacion_A === 'Rechazado' ? 'inactive' : 'pending';
                    const adminStatusText = item.Aprobacion_A === 'Aprobado' ? 'Approved' : 
                                        item.Aprobacion_A === 'Rechazado' ? 'Rejected' : 'Pending';

                    html_container += `
                        <tr data-id="${item.idSolicitud}"
                            data-tipo="${item.Tipo}"
                            data-fecha-inicio="${item.Fecha_inicio}"
                            data-fecha-fin="${item.Fecha_fin}"
                            data-descripcion="${item.Descripcion}">
                            
                            <td>${item.Nombre} ${item.Apellido}</td>
                            <td>${item.Tipo}</td>
                            <td>${formatDate(item.Fecha_inicio)}</td>
                            <td>${formatDate(item.Fecha_fin)}</td>
                            <td class="descripcion-columna">${item.Descripcion}</td>
                            <td>
                                <span class="vacation-status ${leaderStatusClass}">
                                    <div class="dot"></div>
                                    ${leaderStatusText}
                                </span>
                            </td>
                            <td>
                                <span class="vacation-status ${adminStatusClass}">
                                    <div class="dot"></div>
                                    ${adminStatusText}
                                </span>
                            </td>
                            <td>
                                <div class="dropdown">
                                    <button class="action-btn">Actions</button>
                                    <div class="dropdown-content">
                                        <a href="#" class="view-btn" onclick="viewRequest('${item.idSolicitud}')">View</a>
                                        <a href="#" class="edit-btn" onclick="editRequest('${item.idSolicitud}')">Edit</a>
                                        <a href="#" class="delete-btn" onclick="confirmDeleteReq('${item.idSolicitud}')">Delete</a>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                });
            } else {
                html_container += `
                    <tr>
                        <td colspan="8" class="empty-message">No requests available</td>
                    </tr>`;
            }

            html_container += `</tbody></table>`;
            
            let tabla = document.getElementById('table-container');
            tabla.innerHTML = html_container;
            // Aquí puedes manejar la respuesta exitosa
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    }
}