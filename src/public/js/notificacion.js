document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const notificationBell = document.getElementById("notification-bell");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const closeNotifications = document.getElementById("close-notifications");
    const notificationList = document.getElementById("notification-list");
    const notificationCount = document.getElementById("notification-count");
    const markAllReadBtn = document.getElementById("mark-all-read");
  
    console.log("Inicializando sistema de notificaciones");
    console.log("Bell:", notificationBell);
    console.log("Dropdown:", notificationDropdown);
    console.log("List:", notificationList);
  
    // Verificar si los elementos existen
    if (!notificationBell || !notificationDropdown || !notificationList) {
      console.error("Elementos del DOM no encontrados. Verifica los IDs en el HTML.");
      return;
    }
  
    // Cargar notificaciones
    function loadNotifications() {
      console.log("Cargando notificaciones...");
  
      // Mostrar mensaje de carga
      notificationList.innerHTML = '<div class="notification-loading">Cargando notificaciones...</div>';
  
      // Intentar cargar las notificaciones
      fetch("/nuclea/api/notificaciones")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error al obtener notificaciones: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Datos recibidos:", data);
          if (!data.notificaciones) {
            throw new Error("Formato de respuesta inválido");
          }
          updateNotificationUI(data.notificaciones, data.unreadCount);
        })
        .catch((error) => {
          console.error("Error al cargar notificaciones:", error);
          notificationList.innerHTML = `<div class="notification-empty">Error: ${error.message}</div>`;
        });
    }
  
    // Actualizar la UI con las notificaciones
    function updateNotificationUI(notificaciones, unreadCount) {
      console.log("Actualizando UI con", notificaciones.length, "notificaciones");
  
      // Actualizar contador
      if (unreadCount > 0) {
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = "flex";
      } else {
        notificationCount.style.display = "none";
      }
  
      // Limpiar lista actual
      notificationList.innerHTML = "";
  
      // Si no hay notificaciones
      if (notificaciones.length === 0) {
        notificationList.innerHTML = '<div class="notification-empty">No tienes notificaciones</div>';
        return;
      }
  
      // Agregar notificaciones a la lista
      notificaciones.forEach((notificacion) => {
        try {
          console.log("Procesando notificación:", notificacion);
          const notificationItem = document.createElement("div");
          notificationItem.className = `notification-item ${notificacion.leido ? "" : "unread"}`;
          notificationItem.dataset.id = notificacion.idNotificacion;
          notificationItem.dataset.type = notificacion.tipo;
  
          // Formatear fecha
          const date = new Date(notificacion.fecha_creacion);
          const timeAgo = getTimeAgo(date);
  
          notificationItem.innerHTML = `
            <div class="notification-content">
              <p class="notification-title">${notificacion.mensaje}</p>
              <p class="notification-time">${timeAgo}</p>
            </div>
            ${notificacion.leido ? "" : '<span class="unread-indicator"></span>'}
          `;
  
          // Evento para marcar como leída al hacer clic
          notificationItem.addEventListener("click", () => {
            markAsRead(notificacion.idNotificacion);
          });
  
          notificationList.appendChild(notificationItem);
        } catch (err) {
          console.error("Error al procesar notificación:", err, notificacion);
        }
      });
    }

    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      }
  
    // Marcar notificación como leída
    function markAsRead(idNotificacion) {
        const csrfToken = getCsrfToken();
      console.log("Marcando como leída:", idNotificacion);
      fetch(`/nuclea/api/notificaciones/${idNotificacion}/leida`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al marcar notificación como leída");
          }
          return response.json();
        })
        .then(() => {
          loadNotifications(); // Recargar notificaciones
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      }
  
    // Marcar todas como leídas
    function markAllAsRead() {
        const csrfToken = getCsrfToken();
      console.log("Marcando todas como leídas");
      fetch("/nuclea/api/notificaciones/leer-todas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "csrf-token": csrfToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al marcar todas las notificaciones como leídas");
          }
          return response.json();
        })
        .then(() => {
          loadNotifications(); // Recargar notificaciones
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  
    // Función para obtener tiempo relativo
    function getTimeAgo(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
  
      let interval = Math.floor(seconds / 31536000);
      if (interval > 1) return `Hace ${interval} años`;
      if (interval === 1) return `Hace 1 año`;
  
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) return `Hace ${interval} meses`;
      if (interval === 1) return `Hace 1 mes`;
  
      interval = Math.floor(seconds / 86400);
      if (interval > 1) return `Hace ${interval} días`;
      if (interval === 1) return `Hace 1 día`;
  
      interval = Math.floor(seconds / 3600);
      if (interval > 1) return `Hace ${interval} horas`;
      if (interval === 1) return `Hace 1 hora`;
  
      interval = Math.floor(seconds / 60);
      if (interval > 1) return `Hace ${interval} minutos`;
      if (interval === 1) return `Hace 1 minuto`;
  
      return `Hace unos segundos`;
    }
  
    // Mostrar/ocultar dropdown al hacer clic en la campana
    notificationBell.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Clic en campana");
      notificationDropdown.classList.toggle("active");
  
      // Cargar notificaciones cuando se abre el dropdown
      if (notificationDropdown.classList.contains("active")) {
        loadNotifications();
      }
    });
  
    // Cerrar dropdown al hacer clic en el botón de cerrar
    if (closeNotifications) {
      closeNotifications.addEventListener("click", () => {
        console.log("Cerrando dropdown");
        notificationDropdown.classList.remove("active");
      });
    }
  
    // Cerrar dropdown al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      if (
        notificationDropdown &&
        !notificationDropdown.contains(e.target) &&
        e.target !== notificationBell &&
        !notificationBell.contains(e.target)
      ) {
        notificationDropdown.classList.remove("active");
      }
    });
  
    // Evento para marcar todas como leídas
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        markAllAsRead();
      });
    }
  
    // Verificar si hay notificaciones no leídas al cargar la página
    // Pero no mostrar el dropdown automáticamente
    fetch("nuclea//api/notificaciones")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.unreadCount > 0) {
          notificationCount.textContent = data.unreadCount;
          notificationCount.style.display = "flex";
        }
      })
      .catch((error) => {
        console.error("Error al verificar notificaciones:", error);
      });
  });
  