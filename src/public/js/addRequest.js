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
  });
  