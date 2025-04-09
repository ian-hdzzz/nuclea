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

const btn_buscar = document.getElementById("search-input");

btn_buscar.addEventListener("keyup", () => {
    const query = btn_buscar.value.trim();
    


    fetch(`/nuclea/holiday/search?name=${encodeURIComponent(query)}`, { 
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        updateResults(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function formatDate(dateString) {
    // Implementa tu lógica de formato aquí
    return dateString;
}

function updateResults(data) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    if (data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.Nombre_asueto}</td>
                <td>${formatDate(item.Fecha_asueto)}</td>
                <td>
                    <div class="dropdown">
                        <button class="action-btn">Actions</button>
                        <div class="dropdown-content">
                            <button class="edit-btn" onclick="location.href='/nuclea/holiday/update/${item.idHoliday}'">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button class="delete-btn" onclick="location.href='/nuclea/holiday/delete/${item.idHoliday}'">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </td>
            `;
            // ========== DROPDOWN ========== //
            const actionButtons2 = document.querySelectorAll(".action-btn");
              
            actionButtons2.forEach((btn) => {
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
            tbody.appendChild(row);
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
          
          //-------------------------------Fin-------------------------------
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align:center;">No results found</td>`;
        tbody.appendChild(row);
    }
}


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