document.addEventListener('DOMContentLoaded', function () {
  const openModalBtn = document.getElementById('openModal');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');

  // Abrir modal
  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Cerrar modal con botón ✖
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Cerrar modal haciendo clic fuera del contenido
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // ========== DROPDOWN de Actions ========== //
  const actionButtons = document.querySelectorAll(".action-btn");

  actionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Evita que se cierre inmediatamente

      // Cierra todos los demás dropdowns primero
      document.querySelectorAll(".dropdown-content").forEach((content) => {
        if (content !== this.parentElement.querySelector(".dropdown-content")) {
          content.classList.remove("show");
        }
      });

      // Alternar el dropdown actual
      const dropdownContent = this.parentElement.querySelector(".dropdown-content");
      if (dropdownContent) {
        dropdownContent.classList.toggle("show");
      }
    });
  });

  // Cierra cualquier dropdown si se hace clic en otro lugar
  window.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-content").forEach((content) => {
      content.classList.remove("show");
    });
  });
});
