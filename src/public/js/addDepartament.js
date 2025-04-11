document.addEventListener("DOMContentLoaded", () => {
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");

    openModal.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Cierra el modal si se hace clic fuera de él
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
});



// Dropdown functionality for action buttons
const actionButtons = document.querySelectorAll(".action-btn")
  
actionButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.stopPropagation()

    // Close all other dropdowns first
    document.querySelectorAll(".dropdown-content").forEach((content) => {
      if (content !== this.parentElement.querySelector(".dropdown-content")) {
        content.classList.remove("show")
      }
    })

    // Toggle the current dropdown
    const dropdownContent = this.parentElement.querySelector(".dropdown-content")
    if (dropdownContent) {
      dropdownContent.classList.toggle("show")
    }
  })
})

// Close dropdowns when clicking elsewhere on the page
window.addEventListener("click", () => {
  document.querySelectorAll(".dropdown-content").forEach((content) => {
    content.classList.remove("show")
  })
})


document.addEventListener("DOMContentLoaded", () => {
const modal2 = document.getElementById("modal2");
const closeModal2 = document.getElementById("closeModal2");
const editButtons = document.querySelectorAll(".edit-btn");

// Abrir el modal de edición al hacer clic en "Edit"
editButtons.forEach(button => {
    button.addEventListener("click", () => {
        modal2.classList.remove("hidden");
    });
});

// Cerrar el modal cuando se haga clic en la "X"
closeModal2.addEventListener("click", () => {
    modal2.classList.add("hidden");
});

// Cerrar el modal si se hace clic fuera de él
modal2.addEventListener("click", (e) => {
    if (e.target === modal2) {
        modal2.classList.add("hidden");
    }
});
});

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
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';
  
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.idDepartamento}</td>
        <td>${item.Nombre_departamento}</td>
        <td>${item.Nombre_empresa || 'Empresa no encontrada'}</td>
        <td>${item.Descripcion}</td>
        <td class="state">
          <span class="${item.Estado ? 'active' : 'inactive'}">
            <div class="dot"></div>
            ${item.Estado ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td>
          <div class="dropdown">
            <button class="action-btn">Acciones</button>
            <div class="dropdown-content">
              <button class="edit-btn" 
                onclick="location.href='/nuclea/departament/update/${item.idDepartamento}'">
                <i class="fa-solid fa-pen-to-square"></i> Editar
              </button>
              <button class="delete-btn" 
                onclick="confirmDeleteDepartamento('${item.idDepartamento}')">
                <i class="fa-solid fa-trash"></i> Eliminar
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
    const confirmed = confirm("¿Seguro que deseas eliminar?");
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
          alert("Error al eliminar");
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