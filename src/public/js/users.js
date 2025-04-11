document.addEventListener("DOMContentLoaded", () => {
  
    // Modal principal
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");
  
    if (openModal && closeModal && modal) {
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
    }
  
    // Segundo modal
    const openModal2 = document.getElementById("openModal2");
    const closeModal2 = document.getElementById("closeModal2");
    const modal2 = document.getElementById("modal2");
  
    if (openModal2 && closeModal2 && modal2) {
      openModal2.addEventListener("click", () => {
        modal2.classList.remove("hidden");
      });
  
      closeModal2.addEventListener("click", () => {
        modal2.classList.add("hidden");
      });
  
      modal2.addEventListener("click", (e) => {
        if (e.target === modal2) {
          modal2.classList.add("hidden");
        }
      });
    }
  
    // Inicialización de dropdowns para todos los botones que ya están en el DOM
    const initDropdowns = () => {
      document.querySelectorAll(".action-btn").forEach((button) => {
        button.addEventListener("click", function (e) {
          e.stopPropagation();
  
          // Cierra todos los dropdowns que no sean el actual
          document.querySelectorAll(".dropdown-content").forEach((content) => {
            if (content !== this.parentElement.querySelector(".dropdown-content")) {
              content.classList.remove("show");
            }
          });
  
          // Alterna el dropdown actual
          const dropdownContent = this.parentElement.querySelector(".dropdown-content");
          if (dropdownContent) {
            dropdownContent.classList.toggle("show");
          }
        });
      });
    };
  
    // Inicializa dropdowns al inicio
    initDropdowns();
  
    // Cerrar dropdowns al hacer click en cualquier parte de la ventana
    window.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-content").forEach((content) => {
        content.classList.remove("show");
      });
    });
  
  
    // --------------------------------------------------
    // Código AJAX y búsqueda (sin modificaciones)
    // --------------------------------------------------
  
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
              <td>${user.Fecha_inicio_colab}</td>
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
  });
  