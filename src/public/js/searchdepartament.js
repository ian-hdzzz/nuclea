
// Seleccionar el input de búsqueda
const searchInput = document.getElementById('search-input');

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
    fetch(`/nuclea/departament/search?name=${encodeURIComponent(query)}`, {
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



// Event listener para el input
searchInput.addEventListener('keyup', handleSearch);

// Función para actualizar los resultados en la tabla
function updateResults(data) {
    const tbody = document.querySelector("#department-body");
    tbody.innerHTML = '';
  
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.idDepartamento || ''}</td>
        <td>${item.Nombre_departamento || ''}</td>
        <td>${item.Nombre_empresa || ''}</td>
        <td>${item.Descripcion || ''}</td>
        <td class="state">
          <span class="${item.Estado ? 'active' : 'inactive'}">
            <div class="dot"></div>
            ${item.Estado ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div class="dropdown">
            <button class="action-btn">Manage</button>
            <div class="dropdown-content">
              <button class="edit-btn" 
                onclick="location.href='/nuclea/departament/update/${item.idDepartamento}'">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              <button class="delete-btn" 
                onclick="confirmDeleteDepartamento('${item.idDepartamento}')">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </td>
      `;
  

      setupDropdown(row); 
      tbody.appendChild(row);
    });
  }

function setupDropdown(row) {
    const actionBtn = row.querySelector('.action-btn');
    const dropdownContent = row.querySelector('.dropdown-content');

    actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-content').forEach(d => {
            if (d !== dropdownContent) d.classList.remove('show');
        });
        dropdownContent.classList.toggle('show');
    });
}


document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-btn')) {
        document.querySelectorAll('.dropdown-content').forEach(d => {
            d.classList.remove('show');
        });
    }
});

// Mostrar errores
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'search-error';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function confirmDeleteDepartamento(idDepartamento) {
    const confirmed = confirm("¿Are you sure you want to delete this department?");
    if (confirmed) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
      
      fetch(`/nuclea/departament/delete/${idDepartamento}`, {
        method: 'DELETE', 
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          updateResults(data.datos); 
        } else {
          alert("Error deleting department");
        }
      })
      .catch(err => console.error('Error:', err));
    }
  }


document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-btn')) {
      document.querySelectorAll('.dropdown-content').forEach(d => {
        d.classList.remove('show');
      });
    }
  });
  

  function setupDropdown(row) {
    const actionBtn = row.querySelector('.action-btn');
    const dropdownContent = row.querySelector('.dropdown-content');
  
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-content').forEach(d => {
        if (d !== dropdownContent) d.classList.remove('show');
      });
      dropdownContent.classList.toggle('show');
    });
  }