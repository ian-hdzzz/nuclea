document.addEventListener("DOMContentLoaded", () => {
    
    // Elementos del DOM para la búsqueda
    const searchInput = document.getElementById("search-input");
    const tableBody = document.querySelector("#users-table tbody");
  
    // Validación inicial
    if (!searchInput || !tableBody) {
      console.error("Elementos críticos no encontrados");
      return;
    }
  
    // Función para mostrar notificaciones
    const showNotification = (message, isError = false) => {
      const notification = document.createElement("div");
      notification.className = `notification ${isError ? "is-danger" : "is-success"}`;
      notification.textContent = message;
  
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    };
  
    // Función debounce para búsquedas
    const debounce = (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
      };
    };

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
  
    // Función para actualizar resultados en la tabla
    const updateResults = (users) => {
      tableBody.innerHTML =
        users.length > 0
          ? users
              .map(
                (user) => `
          <tr>
              <td>${user.Nombre}</td>
              <td>${user.Departamentos}</td>
              <td>${formatDate(user.Fecha_inicio_colab)}</td>
              <td>${user.Modalidad || "Sin departamento"}</td>
              <td>${user.Ciudad || "Sin departamento"}</td>
              <td class="state">
                  <span class="${user.Estatus ? "active" : "inactive"}">
                      <div class="dot"></div>
                      ${user.Estatus ? "Activo" : "Inactivo"}
                  </span>
              </td>
              <td>
                  <div class="dropdown">
                      <button class="action-btn">Acciones</button>
                      <div class="dropdown-content">
                          <button class="edit-btn" onclick="location.href='/nuclea/users/update/${user.idUsuario}'">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                          </button>
                          <button class="delete-btn" onclick="location.href='/nuclea/users/delete/${user.idUsuario}'">
                            <i class="fa-solid fa-trash"></i> Eliminar
                          </button>
                          <button class="view-btn" onclick="location.href='/nuclea/users/view/${user.idUsuario}'">
                            <i class="fa-solid fa-circle-user"></i> Ver
                          </button>
                      </div>
                  </div>
              </td>
          </tr>
        `
              )
              .join("")
          : '<tr><td colspan="6">No se encontraron usuarios</td></tr>';
  
      // Reinicializamos los dropdowns después de actualizar la tabla
      initDropdowns();
    };
  
    // Manejar búsqueda con AJAX (sin modificaciones)
    const handleSearch = debounce(() => {
      const query = searchInput.value.trim();
  
      fetch(`/nuclea/users/search?term=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error en la búsqueda");
          return response.json();
        })
        .then((data) => updateResults(data))
        .catch((error) => {
          showNotification(error.message, true);
          console.error("Error:", error);
        });
    }, 300);
  
    // Listener para la búsqueda
    searchInput.addEventListener("keyup", handleSearch);
})
  