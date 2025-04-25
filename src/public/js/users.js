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


        // Confirmación antes de eliminar usuario
        document.querySelectorAll(".delete-btn").forEach(button => {
          const originalUrlMatch = button.getAttribute("onclick")?.match(/'(.*?)'/);
          if (!originalUrlMatch) return;
    
          const originalUrl = originalUrlMatch[1];
          button.removeAttribute("onclick");
    
          button.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmDelete = confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
              window.location.href = originalUrl;
            }
          });
        });
        const tutorialSteps = [
          {
              element: "welcome",
              title: "User Management System",
              content: "This guided tour will help you understand how to manage users in the system."
          },
          {
              element: "search-section",
              title: "Search Functionality",
              content: "Use this search box to quickly find users by name."
          },
          {
              element: "add-user-btn",
              title: "Add New User",
              content: "Click this button to add a new user to the system."
          },
          {
              element: "table-section",
              title: "Users Table",
              content: "This table displays all users with their details including name, department, start date, working model, city, and status."
          },
          {
              element: "status-column",
              title: "User Status",
              content: "This column shows whether a user is active or inactive in the system."
          },
          {
              element: "actions-dropdown",
              title: "User Actions",
              content: "Click the 'Manage' button to access options for editing, deleting, or viewing detailed information about a user."
          },
          {
              element: "modal-content",
              title: "Add User Form",
              content: "This form allows you to add a new user by entering their personal information and work details.",
              showModal: true
          },
          {
              element: "complete",
              title: "Tour Complete!",
              content: "You're now ready to use the User Management system. You can restart the tour anytime using the 'Start Tour' button."
          }
      ];

      let currentStep = 0;
      let isTutorialActive = false;

      // Hide loader when page is loaded
      window.addEventListener('load', function() {
          setTimeout(function() {
              document.getElementById('loaderWrapper').style.display = 'none';
              // Auto-start tutorial after loader is hidden
              setTimeout(startTutorial, 1000);
          }, 1500);
      });

      // Initialize tutorial toggle button
      document.getElementById('tutorial-toggle').addEventListener('click', function() {
          startTutorial();
      });

      // Function to start the tutorial
      function startTutorial() {
          const tutorialOverlay = document.getElementById('tutorial-overlay');
          tutorialOverlay.style.display = 'flex';
          isTutorialActive = true;
          currentStep = 0;
          showTutorialStep(currentStep);
      }

      // Function to show a specific tutorial step
      function showTutorialStep(stepIndex) {
          if (stepIndex >= tutorialSteps.length) {
              endTutorial();
              return;
          }

          const step = tutorialSteps[stepIndex];
          const tooltip = document.getElementById('tutorial-tooltip');
          const highlight = document.getElementById('highlight');
          
          // Show modal if needed for this step
          if (step.showModal) {
              document.getElementById('modal').classList.remove('hidden');
          } else if (stepIndex > 0 && tutorialSteps[stepIndex - 1].showModal && !step.showModal) {
              document.getElementById('modal').classList.add('hidden');
          }
          
          // Update tooltip content
          tooltip.innerHTML = `
              <h3>${step.title}</h3>
              <p>${step.content}</p>
              <div class="tooltip-buttons">
                  ${stepIndex > 0 ? '<button class="tooltip-button secondary" id="prev-button">Previous</button>' : ''}
                  <button class="tooltip-button" id="next-button">
                      ${stepIndex === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                  </button>
              </div>
              <div class="progress-dots">
                  ${tutorialSteps.map((_, i) => 
                      `<div class="progress-dot ${i === stepIndex ? 'active' : ''}"></div>`
                  ).join('')}
              </div>
          `;
          
          // Position highlight and tooltip
          if (step.element === "welcome" || step.element === "complete") {
              // Center in the screen for intro and completion
              tooltip.style.top = '50%';
              tooltip.style.left = '50%';
              tooltip.style.transform = 'translate(-50%, -50%)';
              highlight.style.display = 'none';
          } else {
              // Highlight specific element
              const element = document.getElementById(step.element);
              if (element) {
                  const rect = element.getBoundingClientRect();
                  
                  // Position highlight
                  highlight.style.display = 'block';
                  highlight.style.top = `${rect.top - 10}px`;
                  highlight.style.left = `${rect.left - 10}px`;
                  highlight.style.width = `${rect.width + 20}px`;
                  highlight.style.height = `${rect.height + 20}px`;
                  
                  // Position tooltip
                  let tooltipLeft = rect.left + rect.width + 30;
                  let tooltipTop = rect.top;
                  
                  // Check if tooltip would go off-screen to the right
                  if (tooltipLeft + 320 > window.innerWidth) {
                      tooltipLeft = rect.left - 320;
                      if (tooltipLeft < 10) tooltipLeft = 10; // Prevent going off-screen to the left
                  }
                  
                  // Check if tooltip would go off-screen at the bottom
                  if (tooltipTop + 200 > window.innerHeight) {
                      tooltipTop = window.innerHeight - 220;
                      if (tooltipTop < 10) tooltipTop = 10; // Prevent going off-screen at the top
                  }
                  
                  tooltip.style.top = `${tooltipTop}px`;
                  tooltip.style.left = `${tooltipLeft}px`;
                  tooltip.style.transform = 'none';
              }
          }
          
          // Add event listeners to buttons
          if (document.getElementById('next-button')) {
              document.getElementById('next-button').addEventListener('click', function() {
                  showTutorialStep(stepIndex + 1);
              });
          }
          
          if (document.getElementById('prev-button')) {
              document.getElementById('prev-button').addEventListener('click', function() {
                  showTutorialStep(stepIndex - 1);
              });
          }
      }

      // Function to end the tutorial
      function endTutorial() {
          // Make sure modal is hidden when tutorial ends
          document.getElementById('modal').classList.add('hidden');
          
          const tutorialOverlay = document.getElementById('tutorial-overlay');
          tutorialOverlay.innerHTML = `
              <div class="completion-message">
                  <h2>¡Tutorial Completed! 🎉</h2>
                  <p>You're now ready to use the User Management system.</p>
                  <button class="tooltip-button" id="finish-button">Close</button>
              </div>
          `;
          
          document.getElementById('finish-button').addEventListener('click', function() {
              tutorialOverlay.style.display = 'none';
              isTutorialActive = false;
          });
      }

      // Handle window resize to reposition tooltip and highlight
      window.addEventListener('resize', function() {
          if (isTutorialActive) {
              showTutorialStep(currentStep);
          }
      });

      // Original users.js functionality (simplified version)
      document.addEventListener('DOMContentLoaded', function() {
          // Open modal
          const openModalBtn = document.getElementById('openModal');
          const modal = document.getElementById('modal');
          const closeModalBtn = document.getElementById('closeModal');
          
          if (openModalBtn) {
              openModalBtn.addEventListener('click', function() {
                  modal.classList.remove('hidden');
              });
          }
          
          if (closeModalBtn) {
              closeModalBtn.addEventListener('click', function() {
                  modal.classList.add('hidden');
              });
          }
          
          // Dropdown functionality
          const actionBtns = document.querySelectorAll('.action-btn');
          
          actionBtns.forEach(btn => {
              btn.addEventListener('click', function() {
                  const dropdownContent = this.nextElementSibling;
                  dropdownContent.classList.toggle('show');
              });
          });
          
          // Close dropdowns when clicking outside
          window.addEventListener('click', function(event) {
              if (!event.target.matches('.action-btn')) {
                  const dropdowns = document.querySelectorAll('.dropdown-content');
                  dropdowns.forEach(dropdown => {
                      if (dropdown.classList.contains('show')) {
                          dropdown.classList.remove('show');
                      }
                  });
              }
          });
      });

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
  });
  