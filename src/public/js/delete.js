
function formatDate(date) {
    if (!date) {
        return '';
    }
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
  
// Formatea la fecha al formato yyyy-mm-dd
function formatDate2(date) {
    if (!date) {
        return '';
    }

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
            let htmlContainer=`
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
                    htmlContainer+=`
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
                        <td>`;
                    if(dato.Tipo == 'Vacations'){
                        htmlContainer+=`<span class=" vacation-status `;
                        if(dato.Aprobacion_L=='Aprobado'){
                            htmlContainer+=`active"`;
                        }else if(dato.Aprobacion_L=='Rechazado'){
                            htmlContainer+=`inactive"`;
                        }else{
                            htmlContainer+=`pending"`;
                        }
                        htmlContainer+=`<div class="dot"></div>`;
                        if(dato.Aprobacion_L=='Aprobado'){
                            htmlContainer+=`Approved`;
                        }else if(dato.Aprobacion_L=='Rechazado'){
                            htmlContainer+=`Rejected`;
                        }else{
                            htmlContainer+=`Pending`;
                        }
                        htmlContainer+=`</span>`;
                    }else{
                        htmlContainer+=`<span class="vacation-status">N/A</span>`;
                    }
                   
                    
                    
                    htmlContainer+=` 
                        </td>
                        <td>` ;
                    if(dato.Tipo=='Vacations'){
                        htmlContainer+=`<span class=" vacation-status ` ;
                        if(dato.Aprobacion_A=='Aprobado'){
                            htmlContainer+=`active"`;
                        }else if(dato.Aprobacion_A=='Rechazado'){
                            htmlContainer+=`inactive"`;
                        }else{
                            htmlContainer+=`pending"`;
                        }
                        htmlContainer+=`<div class="dot"></div>`;
                        if(dato.Aprobacion_A=='Aprobado'){
                            htmlContainer+=`Approved`;
                        }else if(dato.Aprobacion_A=='Rechazado'){
                            htmlContainer+=`Rejected`;
                        }else{
                            htmlContainer+=`Pending`;
                        }
                        htmlContainer+=` </span>`; 
                    
                    }else{
                        htmlContainer+=`<span class="vacation-status">N/A</span>`;
                    }
                       

                    
                    
                    

                    htmlContainer+=` 
                        </td>
                        <td> 
                        <div class="dropdown"> 
                        <button class="action-btn">Actions</button>
                        <div class="dropdown-content">`; 
                    /** 
                    //{{#if ../puedeAceptar}}
                    htmlContainer+=`<button class="approve-btn" onclick="approveRequest('${dato.idSolicitud}')">
                        <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button class="reject-btn" onclick="rejectRequest('${dato.idSolicitud}')">
                        <i class="fa-solid fa-xmark"></i> Reject
                        </button>`;
                    
                    //{{else}} 
                    */
                   htmlContainer+=`
                        <button class="edit-btn" onclick="editRequest('${dato.idSolicitud}')">
                          <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="confirmDeleteReq('${dato.idSolicitud}')">
                          <i class="fa-solid fa-trash"></i> Delete
                        </button>`;
                    //Fin del else 
            
                })
                htmlContainer+=`</div>
                        </div>
                        </td>
                    </tr>`;

            } else {
                htmlContainer+=`<tr>
                <td colspan="7" class="empty-message">No requests available</td>
              </tr>`;
            }
            htmlContainer+=`</tbody>
                    </table>
                </div>`;
            let tabla =document.getElementById('table-container');
            tabla.innerHTML=htmlContainer;
            //---------------------------------Para que funcione el drop---------------------


            
                // ========== DROPDOWN ========== //
                const actionButtons = document.querySelectorAll(".action-btn");
              
                actionButtons.forEach((btn) => {
                  btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    document.querySelectorAll(".dropdown-content").forEach((content) => {
                      if (content !== btn.nextElementSibling) {
                        content.classList.remove("show");
                      }
                    });
              
                    const dropdown = btn.nextElementSibling;
                    if (dropdown) {
                      dropdown.classList.toggle("show");
                    }
                  });
                });
              
                window.addEventListener("click", () => {
                  document.querySelectorAll(".dropdown-content").forEach((content) => {
                    content.classList.remove("show");
                  });
                });
              
              // -------------------------------Fin-------------------------------
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    }
}