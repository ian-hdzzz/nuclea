

// Variables para Google API
const configElement = document.getElementById('google-calendar-config');
const CLIENT_ID = configElement.dataset.clientId;
const API_KEY = configElement.dataset.apiKey;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
console.log('CLIENT_ID:', CLIENT_ID);
let tokenClient;
let gapiInited = false;
let gisInited = false;

// Función para inicializar la API de Google
function initializeGapiClient() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(() => {
    gapiInited = true;
    maybeEnableButtons();
  });
}

// Inicializar el cliente de Google Identity Services
function gisInit() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Será definido después
  });
  gisInited = true;
  maybeEnableButtons();
}

// Habilitar el botón cuando ambas bibliotecas estén cargadas
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.querySelector('.sync-button').removeAttribute('disabled');
  }
}

// Cargar las APIs de Google
function loadGoogleAPIs() {
  gapi.load('client', initializeGapiClient);
  gisInit();
}

// 2. Añadir el evento de clic al botón de sincronización
document.querySelector('.sync-button').addEventListener('click', handleCalendarSync);

// 3. Función para manejar la sincronización
// Función para manejar la sincronización
function handleCalendarSync() {
    // Mostrar cargando
    document.querySelector('.sync-button').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sincronizando...';
    document.querySelector('.sync-button').disabled = true;
    
    if (gapi.client.getToken() === null) {
      // No hemos iniciado sesión, solicitamos autorización
      tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          console.error('Error de autenticación:', resp);
          alert(`Error de autenticación: ${resp.error}`);
          resetSyncButton();
          return;
        }
        try {
          await fetchGoogleCalendarEvents();
        } catch (error) {
          console.error('Error durante la sincronización:', error);
          alert('Error durante la sincronización. Por favor intenta nuevamente.');
        } finally {
          resetSyncButton();
        }
      };
  
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Ya tenemos un token, obtenemos los eventos
      fetchGoogleCalendarEvents()
        .finally(() => resetSyncButton());
    }
    
    function resetSyncButton() {
      document.querySelector('.sync-button').innerHTML = '<i class="fa-regular fa-calendar"></i> Sync with Google Calendar';
      document.querySelector('.sync-button').disabled = false;
    }
  }

// 4. Función para obtener eventos de Google Calendar
async function fetchGoogleCalendarEvents() {
  try {
    // Definir el rango de fechas (30 días)
    const now = new Date();
    const timeMin = now.toISOString();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30);
    const timeMax = futureDate.toISOString();

    // Realizar la petición
    const response = await gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': timeMin,
      'timeMax': timeMax,
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 50,
      'orderBy': 'startTime'
    });

    // Procesar los eventos recibidos
    processGoogleCalendarEvents(response.result.items);
  } catch (error) {
    console.error('Error al obtener eventos de Google Calendar:', error);
    alert('Error al sincronizar con Google Calendar. Por favor intenta nuevamente.');
  }
}

// 5. Función para procesar los eventos de Google Calendar
function processGoogleCalendarEvents(googleEvents) {
    if (!googleEvents || googleEvents.length === 0) {
      alert('No se encontraron eventos en Google Calendar.');
      return;
    }
  
    console.log('Eventos recibidos de Google Calendar:', googleEvents);
    
    // Convertir eventos de Google Calendar a tu formato
    const newEvents = googleEvents.map((gEvent, index) => {
      // Determinar el tipo de evento basado en el título o descripción
      let eventType = "meeting"; // Por defecto
      let icon = "👤";
      
      const summary = gEvent.summary?.toLowerCase() || '';
      const description = gEvent.description?.toLowerCase() || '';
      
      // Identificar tipo de evento por palabras clave
      if (summary.includes('vacation') || summary.includes('vacaciones') || 
          description.includes('vacation') || description.includes('vacaciones')) {
        eventType = "vacation";
        icon = "🌙";
      } else if (summary.includes('holiday') || summary.includes('festivo') ||
                description.includes('holiday') || description.includes('festivo')) {
        eventType = "holiday";
        icon = "📌";
      }
      
      // Verificar si el evento dura todo el día
      const isAllDay = !gEvent.start.dateTime;
      
      // Crear fechas de inicio y fin
      let startDate, endDate;
      
      if (isAllDay) {
        startDate = new Date(gEvent.start.date);
        endDate = new Date(gEvent.end.date);
        
        // Ajustar la fecha de fin para eventos de todo el día
        // Google Calendar establece la fecha de fin como el día siguiente
        endDate.setDate(endDate.getDate() - 1);
      } else {
        startDate = new Date(gEvent.start.dateTime);
        endDate = new Date(gEvent.end.dateTime);
      }
      
      console.log(`Procesando evento "${gEvent.summary}": ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}, tipo: ${eventType}`);
      
      // Crear el objeto de evento en tu formato
      return {
        id: `google-${gEvent.id}`, // ID único para eventos de Google
        title: gEvent.summary || "Sin título",
        type: eventType,
        start: startDate,
        end: endDate,
        icon: icon,
        allDay: isAllDay,
        source: 'google'  // Marcar como evento de Google
      };
    });
    
    console.log('Eventos procesados:', newEvents);
    
    // Combinar con eventos existentes, evitando duplicados
    const existingIds = events.map(e => e.id);
    const uniqueNewEvents = newEvents.filter(e => !existingIds.includes(e.id));
    
    // Agregar los nuevos eventos a tu array existente
    events.push(...uniqueNewEvents);
    
    console.log('Total de eventos después de la sincronización:', events.length);
    
    // Actualizar la interfaz
    generateCalendar(selectedMonth, selectedYear);
    generateUpcomingEvents();
    updateStats();
    
    // Mostrar mensaje de éxito
    alert(`Sincronización completada. Se agregaron ${uniqueNewEvents.length} eventos.`);
  }

// 6. Modificar la función de inicialización para cargar las APIs de Google
function init() {
  generateCalendar(selectedMonth, selectedYear);
  generateUpcomingEvents();
  updateStats();
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  init();
  // Cargar las APIs de Google cuando la página esté lista
  if (document.querySelector('.sync-button')) {
    loadGoogleAPIs();
  }
});


const events = [
    {
        id: 1,
        title: "One-to-One con Manager",
        type: "meeting",
        start: new Date(2025, 3, 20, 10, 0), // 20 de abril de 2025, 10:00
        end: new Date(2025, 3, 20, 11, 0),   // 20 de abril de 2025, 11:00
        icon: "👤"
    },
    {
        id: 2,
        title: "One-to-One con Director",
        type: "meeting",
        start: new Date(2025, 3, 22, 15, 30), // 22 de abril de 2025, 15:30
        end: new Date(2025, 3, 22, 16, 30),   // 22 de abril de 2025, 16:30
        icon: "👤"
    },
    {
        id: 3,
        title: "Vacaciones",
        type: "vacation",
        start: new Date(2025, 3, 25),        // 25 de abril de 2025
        end: new Date(2025, 3, 30),          // 30 de abril de 2025
        icon: "🌙",
        allDay: true
    },
    {
        id: 4,
        title: "Día de la Independencia",
        type: "holiday",
        start: new Date(2025, 4, 1),         // 1 de mayo de 2025
        end: new Date(2025, 4, 1),           // 1 de mayo de 2025
        icon: "📌",
        allDay: true
    }
];

// Variables globales
let currentDate = new Date();
let selectedMonth = currentDate.getMonth();
let selectedYear = currentDate.getFullYear();

// Nombres de meses en español
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para formatear la fecha
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Función para formatear la hora
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe mostrarse como '12'
    return `${hours}:${minutes} ${ampm}`;
}

// Función para obtener eventos de un día específico
// Función mejorada para obtener eventos de un día específico
function getEventsForDay(day, month, year) {
    const targetDate = new Date(year, month, day);
    const targetDateStr = targetDate.toDateString(); // Para comparación de fechas
    
    return events.filter(event => {
      // Crear copias de las fechas para no modificar los objetos originales
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Para eventos de todo el día
      if (event.allDay) {
        // Normalizar las fechas (quitar horas/minutos)
        const normalizedStart = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
        const normalizedEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
        const normalizedTarget = new Date(year, month, day);
        
        // Verificar si la fecha objetivo está dentro del rango del evento
        return normalizedTarget >= normalizedStart && normalizedTarget <= normalizedEnd;
      }
      
      // Para eventos normales (con hora específica)
      return eventStart.getDate() === day && 
             eventStart.getMonth() === month && 
             eventStart.getFullYear() === year;
    });
  }


// Function to generate the calendar with events below numbers
// Función mejorada para generar el calendario
function generateCalendar(month, year) {
    console.log(`Generando calendario para ${monthNames[month]} ${year}`);
    
    // Update title of the month
    document.querySelector(".month-title").textContent = `${monthNames[month]} ${year}`;
    
    // Clear existing days
    const daysContainer = document.querySelector(".days");
    daysContainer.innerHTML = "";
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Get the last day of the previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Days from previous month (to fill the first week)
    for (let i = 0; i < startingDay; i++) {
      const day = prevMonthLastDay - startingDay + i + 1;
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.style.opacity = "0.5";
      
      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = day;
      dayDiv.appendChild(dayNumber);
      
      daysContainer.appendChild(dayDiv);
    }
    
    // Days of the current month
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      
      // Add day number
      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = i;
      dayDiv.appendChild(dayNumber);
      
      // Check if it's today
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayDiv.classList.add("today");
      }
      
      // Check for events on this day
      const dayEvents = getEventsForDay(i, month, year);
      
      if (dayEvents.length > 0) {
        console.log(`Día ${i} tiene ${dayEvents.length} eventos:`, dayEvents);
        
        // Add appropriate class based on event type
        const hasVacation = dayEvents.some(e => e.type === "vacation");
        const hasHoliday = dayEvents.some(e => e.type === "holiday");
        
        if (hasVacation) dayDiv.classList.add("vacation-day");
        if (hasHoliday) dayDiv.classList.add("holiday-day");
        
        // Create event indicators
        const eventsContainer = document.createElement("div");
        eventsContainer.classList.add("day-events");
        
        // Mostrar hasta 2 eventos
        dayEvents.slice(0, 2).forEach(event => {
          const eventTag = document.createElement("div");
          eventTag.classList.add("day-event-tag");
          
          // Add class based on event type
          if (event.type === "meeting") {
            eventTag.classList.add("meeting");
            const shortTitle = event.title.length > 10 ? 
                               event.title.substring(0, 8) + "..." : 
                               event.title;
            eventTag.textContent = shortTitle;
          } else if (event.type === "vacation") {
            eventTag.classList.add("vacation");
            eventTag.textContent = "Vacation";
          } else if (event.type === "holiday") {
            eventTag.classList.add("holiday");
            eventTag.textContent = "Holiday";
          }
          
          eventsContainer.appendChild(eventTag);
        });
        
        // Si hay más de 2 eventos, mostrar indicador
        if (dayEvents.length > 2) {
          const moreEvents = document.createElement("div");
          moreEvents.classList.add("more-events");
          moreEvents.textContent = `+${dayEvents.length - 2} más`;
          eventsContainer.appendChild(moreEvents);
        }
        
        dayDiv.appendChild(eventsContainer);
      }
      
      daysContainer.appendChild(dayDiv);
    }
    
    // Days of the next month
    const remainingDays = 35 - (startingDay + totalDays); // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.style.opacity = "0.5";
      
      const dayNumber = document.createElement("div");
      dayNumber.classList.add("day-number");
      dayNumber.textContent = i;
      dayDiv.appendChild(dayNumber);
      
      daysContainer.appendChild(dayDiv);
    }
  }
// Función para generar la lista de próximos eventos
function generateUpcomingEvents() {
    const container = document.querySelector(".upcoming-events");
    // Mantener el títul
    const title = container.querySelector("h2");
    container.innerHTML = "";
    container.appendChild(title);
    
    // Filtrar eventos futuros y ordenarlos por fecha
    const now = new Date();
    const futureEvents = events
        .filter(event => new Date(event.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Generar HTML para cada evento
    futureEvents.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        
        let eventTagClass = "";
        if (event.type === "vacation") {
            eventTagClass = "vacation";
        } else if (event.type === "holiday") {
            eventTagClass = "holiday";
        }
        
        let dateInfo;
        if (event.allDay) {
            if (event.start.getTime() === event.end.getTime()) {
                dateInfo = `<span><i class="fa-regular fa-calendar"></i>${formatDate(event.start)}</span>`;
            } else {
                dateInfo = `<span><i class="fa-regular fa-calendar"></i> ${formatDate(event.start)} - ${formatDate(event.end)}</span>`;
            }
        } else {
            dateInfo = `<span><i class="fa-regular fa-calendar"></i>  ${formatDate(event.start)}</span><span style="margin-left: 10px;"><i class="fa-regular fa-clock"></i>${formatTime(event.start)} - ${formatTime(event.end)}</span>`;
        }
        
        eventItem.innerHTML = `
            <div class="event-title">
                <span class="event-icon ${eventTagClass}">${event.icon}</span>
                <div class="event-details">
                    <div>${event.title}</div>
                    <div class="event-date">
                        ${dateInfo}
                    </div>
                </div>
            </div>
            <span class="event-tag ${eventTagClass}">${
                event.type === "meeting" ? "Meeting" : 
                event.type === "vacation" ? "Vacation" : "Holiday"
            }</span>
        `;
        
        container.appendChild(eventItem);
    });
    
    // Si no hay eventos futuros
    if (futureEvents.length === 0) {
        const noEvents = document.createElement("p");
        noEvents.textContent = "No hay eventos próximos.";
        container.appendChild(noEvents);
    }
}

// Función para actualizar estadísticas
function updateStats() {
    // Contar reuniones one-to-one
    const oneToOneCount = events.filter(e => e.type === "meeting").length;
    document.querySelector(".stat-count").textContent = oneToOneCount;
    
    // Contar días de vacaciones
    let vacationDays = 0;
    events.filter(e => e.type === "vacation").forEach(vacation => {
        const start = new Date(vacation.start);
        const end = new Date(vacation.end);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el día final
        vacationDays += diffDays;
    });
    document.querySelector(".stat-count.purple").textContent = vacationDays;
    
    // Contar días festivos
    const holidayCount = events.filter(e => e.type === "holiday").length;
    document.querySelector(".stat-count.green").textContent = holidayCount;
}

// Configurar navegación de meses
document.querySelector(".fa-angle-left").addEventListener("click", function() {
    selectedMonth--;
    if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear--;
    }
    generateCalendar(selectedMonth, selectedYear);
});

document.querySelector(".fa-angle-right").addEventListener("click", function() {
    selectedMonth++;
    if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear++;
    }
    generateCalendar(selectedMonth, selectedYear);
});

// Toggle entre vistas de calendario y próximos eventos
const toggleContainer = document.getElementById('viewToggle');
const toggleSlider = document.querySelector('.toggle-slider');
const toggleOptions = document.querySelectorAll('.toggle-option');
const calendarView = document.querySelector(".calendar-view");
const upcomingView = document.querySelector(".upcoming-events");

// Valor inicial
let currentView = 'calendar';

toggleContainer.addEventListener('click', function(e) {
    const clickedOption = e.target.closest('.toggle-option');
    
    if (clickedOption) {
        const newView = clickedOption.dataset.view;
        
        if (newView !== currentView) {
            // Actualizar apariencia del toggle
            toggleOptions.forEach(option => {
                if (option.dataset.view === newView) {
                    option.classList.add('active');
                    option.classList.remove('inactive');
                } else {
                    option.classList.remove('active');
                    option.classList.add('inactive');
                }
            });
            
            // Mover el slider
            if (newView === 'calendar') {
                toggleSlider.classList.remove('right');
            } else {
                toggleSlider.classList.add('right');
            }
            
            // Mostrar la vista apropiada
            if (newView === 'calendar') {
                calendarView.style.display = 'block';
                upcomingView.style.display = 'none';
            } else {
                calendarView.style.display = 'none';
                upcomingView.style.display = 'block';
            }
            
            currentView = newView;
        }
    }
});

// Inicializar toggle
toggleOptions.forEach(option => {
    if (option.dataset.view !== currentView) {
        option.classList.add('inactive');
    }
});

// Inicializar posición del slider
if (currentView === 'upcoming') {
    toggleSlider.classList.add('left');
}

// Inicializar la aplicación
function init() {
    generateCalendar(selectedMonth, selectedYear);
    generateUpcomingEvents();
    updateStats();
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);

// Si la página ya está cargada, iniciar inmediatamente
if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
}

async function fetchGoogleCalendarEvents() {
    try {
      console.log('Obteniendo eventos de Google Calendar...');
      
      // Definir el rango de fechas (30 días)
      const now = new Date();
      const timeMin = now.toISOString();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + 30);
      const timeMax = futureDate.toISOString();
  
      console.log(`Buscando eventos desde ${timeMin} hasta ${timeMax}`);
  
      // Realizar la petición
      const response = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin,
        'timeMax': timeMax,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 1000,
        'orderBy': 'startTime'
      });
  
      console.log('Respuesta de Google Calendar:', response);
      
      // Comprobar si hay eventos
      if (!response.result.items || response.result.items.length === 0) {
        alert('No se encontraron eventos en Google Calendar para el período seleccionado.');
        return;
      }
  
      // Procesar los eventos recibidos
      processGoogleCalendarEvents(response.result.items);
    } catch (error) {
      console.error('Error al obtener eventos de Google Calendar:', error);
      alert(`Error al sincronizar con Google Calendar: ${error.message}`);
    }
  }
  // Agregar en tu HTML después del botón de sincronización
document.querySelector('.sync-button').insertAdjacentHTML('afterend', `
    <button class="clear-button" id="clearGoogleEvents" style="margin-left: 10px;">
      <i class="fa-regular fa-trash-can"></i> Limpiar eventos de Google
    </button>
  `);
  
  // Agregar el evento para limpiar
  document.getElementById('clearGoogleEvents').addEventListener('click', function() {
    // Filtrar y mantener solo los eventos originales
    events = events.filter(event => !event.source || event.source !== 'google');
    
    // Actualizar UI
    generateCalendar(selectedMonth, selectedYear);
    generateUpcomingEvents();
    updateStats();
    
    alert('Eventos importados de Google Calendar eliminados.');
  });


// ----------sidebar.js----------
document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar todos los encabezados de tipos de eventos
  const eventTypeHeaders = document.querySelectorAll('.event-type-header');
  
  // Agregar listeners de clic a cada encabezado
  eventTypeHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Obtener el ID del tipo de evento
      const eventTypeId = this.getAttribute('data-event-type');
      // Obtener la lista de eventos asociada
      const eventList = document.getElementById(`event-list-${eventTypeId}`);
      
      // Alternar la clase active en el encabezado
      this.classList.toggle('active');
      
      // Comprobar si la lista está oculta
      if (eventList.classList.contains('hidden')) {
        // Mostrar la lista
        eventList.classList.remove('hidden');
        // Pequeño retraso para permitir que el navegador procese el cambio de display
        setTimeout(() => {
          eventList.classList.add('show');
        }, 10);
      } else {
        // Ocultar la lista
        eventList.classList.remove('show');
        // Esperar a que finalice la transición antes de ocultarla completamente
        eventList.addEventListener('transitionend', function handler() {
          eventList.classList.add('hidden');
          eventList.removeEventListener('transitionend', handler);
        });
      }
      
      // Para verificar que está funcionando (puedes eliminar después)
      console.log('Click en tipo de evento:', eventTypeId);
    });
  });
  
  // Verifica que el script se esté ejecutando
  console.log('Script de eventos cargado correctamente');
});