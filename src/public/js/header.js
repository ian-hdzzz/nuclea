document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const notificationBell = document.getElementById("notification-bell")
    const notificationDropdown = document.getElementById("notification-dropdown")
    const closeNotifications = document.getElementById("close-notifications")
  
    // Mostrar/ocultar dropdown al hacer clic en la campana
    notificationBell.addEventListener("click", (e) => {
      e.preventDefault()
      notificationDropdown.classList.toggle("active")
    })
  
    // Cerrar dropdown al hacer clic en el botón de cerrar
    closeNotifications.addEventListener("click", () => {
      notificationDropdown.classList.remove("active")
    })
  
    // Cerrar dropdown al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      if (
        !notificationDropdown.contains(e.target) &&
        e.target !== notificationBell &&
        !notificationBell.contains(e.target)
      ) {
        notificationDropdown.classList.remove("active")
      }
    })
  })
  