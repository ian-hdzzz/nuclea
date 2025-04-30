document.addEventListener('DOMContentLoaded', function () {
    const idUsuario = document.getElementById('employeeData').dataset.idusuario;
    const tableCollabDiv = document.querySelector('.tableCollab');


    console.log('ID de usuario desde el HTML:', idUsuario);
    // ---------------render employee data----------------
    function renderEmployeeData(employee, interviewHistory) {
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            
            // Obtener día, mes y año
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses van de 0 a 11
            const year = date.getFullYear();
            
            // Formato d/m/a
            return `${day}/${month}/${year}`;
        };

        let timeInCompany = 'N/A';
        if (employee.fechaInicio) {
            const startDate = new Date(employee.fechaInicio);
            const currentDate = new Date();

            const years = currentDate.getFullYear() - startDate.getFullYear();
            const months = currentDate.getMonth() - startDate.getMonth();
            const days = currentDate.getDate() - startDate.getDate();

            timeInCompany = `${years} años, ${months < 0 ? months + 12 : months} meses, ${days < 0 ? days + 30 : days} días`;
        }

        let html = `
            <div class="employee-profile one">
                <div class="profile-header">
                    <div class="employee-avatar">${employee.initial}</div>
                    <div class="employee-info">
                        <h2>${employee.nombre} ${employee.apellidos}</h2>
                        <p class="employee-department">Modality: ${employee.modalidad || 'No modality specified'}</p>
                    </div>
                </div>
                <div class="profile-details">
                    <p><strong>Start Date:</strong> ${formatDate(employee.fechaInicio)}</p>
                    <p><strong>Time in Company:</strong> ${timeInCompany}</p>
                </div>
            </div>
        `;

        if (interviewHistory && interviewHistory.length > 0) {
            html += `
                <div class="interview-history">
                    <h3>Interview History for ${employee.nombre}</h3>
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Interviewer</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            interviewHistory.forEach(interview => {
                const interviewerName = `${interview.entrevistadorNombre || ''} ${interview.entrevistadorApellidos || ''}`.trim();
                html += `
                    <tr>
                        <td>${formatDate(interview.fechaEntrevista)}</td>
                        <td>${interviewerName || 'Unknown'}</td>
                        <td>${interview.completada ? 'Completed' : 'In Progress'}</td>
                        <td>
                            <button class="btn-view" data-id="${interview.id}" data-employee="${employee.id}">
                                View Details
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            html += `
                <div class="no-interviews">
                    <p>No interview history available for this employee.</p>
                </div>
            `;
        }

        if (tableCollabDiv) {
            tableCollabDiv.innerHTML = html;

            const viewButtons = tableCollabDiv.querySelectorAll('.btn-view');
            viewButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const interviewId = this.getAttribute('data-id');
                    window.location.href = `/nuclea/oneEmployee`;
                });
            });
        }
    }
    function handleEmployeeSelection(idUsuario) {

        if (idUsuario) {
            if (tableCollabDiv) {
                tableCollabDiv.innerHTML = '<div class="loading">Loading employee data...</div>';

                console.log("Fetching employee history for ID:", idUsuario);
                fetch(`/nuclea/oneEmployeeHistory`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Historial de entrevistas:', data);
                        if (data.success) {
                            renderEmployeeData(data.employee, data.interviewHistory);
                        } else {
                            tableCollabDiv.innerHTML = `<div class="error">Error: ${data.message}</div>`;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching employee data:', error);
                        tableCollabDiv.innerHTML = '<div class="error">Error loading employee data. Please try again.</div>';
                    });
            }
        } 
    }

  // Función para inicializar el acordeón
  function initializeAccordion() {
      const categoryHeaders = document.querySelectorAll('.category-header');
      console.log('Headers encontrados:', categoryHeaders.length);
  
      // Remover listeners existentes primero
      categoryHeaders.forEach(header => {
          const newHeader = header.cloneNode(true);
          header.parentNode.replaceChild(newHeader, header);
      });
  
      // Actualizar la referencia después de clonar
      const newHeaders = document.querySelectorAll('.category-header');
  
      // Cerrar todos los paneles primero
      document.querySelectorAll('.category-details').forEach(details => {
          details.classList.add('collapsed');
      });
  
      // Abrir el primer panel por defecto
      if (newHeaders.length > 0) {
          const firstHeader = newHeaders[0];
          const firstDetails = firstHeader.nextElementSibling;
          firstHeader.classList.add('active');
          if (firstDetails) {
              firstDetails.classList.remove('collapsed');
          }
      }
  }
  
  // Función para alternar el estado de un elemento del acordeón
  function toggleAccordionItem(header) {
      if (!header) return;
      
      const details = header.nextElementSibling;
      if (!details) return;
  
      // Verificar si el panel está colapsado
      const isCollapsed = details.classList.contains('collapsed');
      
      // Cerrar todos los paneles primero
      document.querySelectorAll('.category-header').forEach(h => {
          h.classList.remove('active');
          const d = h.nextElementSibling;
          if (d) {
              d.classList.add('collapsed');
          }
      });
  
      // Si estaba colapsado, abrir este panel
      if (isCollapsed) {
          header.classList.add('active');
          details.classList.remove('collapsed');
      }
      
      // Ajustar altura del contenedor si es necesario
      adjustContainerHeight();
  }
  
  // Helper para manejar la altura del contenedor
  function adjustContainerHeight() {
      const container = document.querySelector('.statistics-container');
      const activeDetails = document.querySelector('.category-details:not(.collapsed)');
      
      if (container && activeDetails) {
          const minHeight = 400;
          const contentHeight = activeDetails.scrollHeight + 200;
          container.style.minHeight = `${Math.max(minHeight, contentHeight)}px`;
      }
  }
  
  initializeAccordion();
    handleEmployeeSelection(idUsuario);
});