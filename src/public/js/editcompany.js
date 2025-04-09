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
          window.location.href = "/nuclea/company";
      }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Modal functionality
  const modal = document.getElementById("modal")
  const openModalBtn = document.getElementById("openModal")
  const closeModalBtn = document.getElementById("closeModal")

  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.remove("hidden")
    })
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden")
    })
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
})
