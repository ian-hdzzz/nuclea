
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
  
// Formatea la fecha al formato yyyy-mm-dd
function formatDate2(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            let html_container=`
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
            <tbody>
            `;
            if(data.datos.length >0){
                data.datos.forEach(dato => {
                    html_container+=`
                    <tr
                        data-id="${dato.idSolicitud}" 
                        data-tipo="${dato.Tipo}" 
                        data-fecha-inicio="${formatDate2(dato.Fecha_inicio)}" 
                        data-fecha-fin="${formatDate2(dato.Fecha_fin)}" 
                        data-descripcion="${dato.Descripcion}"
                    >
                        <td>${dato.Nombre} ${dato.Apellido}</td>
                        <td>${dato.Tipo}</td>
                        <td>${formatDate(dato.Fecha_inicio)}</td>
                        <td>${formatDate(dato.Fecha_fin)}</td>
                    <td class="descripcion-columna">${dato.Descripcion}</td>
                        <td>
                        <span class=" vacation-status `;
                    if(dato.Aprobacion_L=='Aprobado'){
                        html_container+=`active`;
                    }else if(dato.Aprobacion_L=='Rechazado'){
                        html_container+=`inactive`;
                    }else{
                        html_container+=`pending`;
                    }
                    html_container+=`<div class="dot"></div>`;
                    
                    if(dato.Aprobacion_L=='Aprobado'){
                        html_container+=`Approved`;
                    }else if(dato.Aprobacion_L=='Rechazado'){
                        html_container+=`Rejected`;
                    }else{
                        html_container+=`Pending`;
                    }
                    html_container+=` </span>
                        </td>
                        <td>
                        <span class=" vacation-status` ;
                    

                    if(dato.Aprobacion_A=='Aprobado'){
                        html_container+=`active`;
                    }else if(dato.Aprobacion_A=='Rechazado'){
                        html_container+=`inactive`;
                    }else{
                        html_container+=`pending`;
                    }
                    html_container+=`<div class="dot"></div>`;
                    
                    if(dato.Aprobacion_A=='Aprobado'){
                        html_container+=`Approved`;
                    }else if(dato.Aprobacion_A=='Rechazado'){
                        html_container+=`Rejected`;
                    }else{
                        html_container+=`Pending`;
                    }

                    html_container+=` </span>
                        </td>
                        <td> 
                        <div class="dropdown"> 
                        <button class="action-btn">Actions</button>
                        <div class="dropdown-content">`; 
                    //{{#if ../puedeAceptar}}
                    html_container+=`<button class="approve-btn" onclick="approveRequest('${dato.idSolicitud}')">
                        <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button class="reject-btn" onclick="rejectRequest('${dato.idSolicitud}')">
                        <i class="fa-solid fa-xmark"></i> Reject
                        </button>`;
                    
                    //{{else}}
                   html_container+=`
                        <button class="edit-btn" onclick="editRequest('${dato.idSolicitud}')">
                          <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="confirmDeleteReq('${dato.idSolicitud}')">
                          <i class="fa-solid fa-trash"></i> Delete
                        </button>`;
                    //Fin del else 
            
                })
                html_container+=`</div>
                        </div>
                        </td>
                    </tr>`;

            }else{
                html_container+=`<tr>
                <td colspan="7" class="empty-message">No requests available</td>
              </tr>`;
            }
            html_container+=`</tbody>
                    </table>
                </div>`;
            let tabla =document.getElementById('table-container');
            tabla.innerHTML=html_container;
            
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    }
}