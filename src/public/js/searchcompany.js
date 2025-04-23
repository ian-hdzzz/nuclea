document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el input de búsqueda
    const searchInput = document.getElementById("search-input");
    
    // Verificar si el elemento existe
    if (searchInput) {
        // Función debounce para optimizar las peticiones
        function debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => { func.apply(this, args); }, timeout);
            };
        }
        
        // Función principal de búsqueda
        const handleSearch = debounce(() => {
            const query = searchInput.value.trim();
            
            // Realizar petición AJAX
            fetch(`/nuclea/company/search?name=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta');
                return response.json();
            })
            .then(data => updateResults(data))
            .catch(error => {
                console.error('Error:', error);
                showError('Error al realizar la búsqueda');
            });
        });
        
        // Asignar el event listener
        searchInput.addEventListener('keyup', handleSearch);
        
        // Función para actualizar los resultados en la tabla
        function updateResults(data) {
            const tbody = document.querySelector('table tbody');
            
            // Limpiar la tabla
            tbody.innerHTML = '';
            
            // Verificar si hay resultados
            if (data.length === 0) {
                // Si no hay resultados, mostrar mensaje
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="4" style="text-align: center;">No companies found</td>';
                tbody.appendChild(row);
                return;
            }
            
            // Iterar sobre los resultados y añadirlos a la tabla
            data.forEach(item => {
                const row = document.createElement('tr');
                
                // Construir el HTML para cada fila
                let rowHtml = `
                    <td>${item.Nombre_empresa}</td>
                    <td class="state">
                        <span class="${item.Estado ? 'active' : 'inactive'}">
                            <div class="dot"></div>
                            ${item.Estado ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td class="tdactions">
                        <div class="dropdown">
                            <button class="action-btn">Actions</button>
                            <div class="dropdown-content">
                                <button class="edit-btn"  onclick="location.href='/nuclea/company/update/${item.idEmpresa}'">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                                <button class="delete-btn" onclick="location.href='/nuclea/company/delete/${item.idEmpresa}'">
                                <i class="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </td>
                `;
                
                // Asignar el HTML a la fila
                row.innerHTML = rowHtml;
                
                // Configurar el dropdown para esta fila
                setupDropdown(row);
                
                // Añadir la fila a la tabla
                tbody.appendChild(row);
            });
        }
        
        // Configurar el dropdown para una fila
        function setupDropdown(row) {
            const actionBtn = row.querySelector('.action-btn');
            if (actionBtn) {
                const dropdownContent = actionBtn.nextElementSibling;
                
                actionBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Cerrar todos los otros dropdowns
                    document.querySelectorAll('.dropdown-content').forEach(content => {
                        if (content !== dropdownContent) {
                            content.classList.remove('show');
                        }
                    });
                    
                    // Alternar este dropdown
                    dropdownContent.classList.toggle('show');
                });
            }
        }
        
        // Mostrar mensaje de error
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.textContent = message;
            
            const container = document.querySelector('.container');
            container.insertBefore(errorDiv, container.firstChild);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
        }

    }
});