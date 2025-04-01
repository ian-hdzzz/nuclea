document.addEventListener("DOMContentLoaded", () => {
    // ========== MODAL ========== //
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");
  
    if (openModal && closeModal && modal) {
      openModal.addEventListener("click", () => modal.classList.remove("hidden"));
      closeModal.addEventListener("click", () => modal.classList.add("hidden"));
  
      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    }
  
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
  });
  