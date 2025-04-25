// Variables para Google API
const configElement = document.getElementById('google-calendar-config');
const CLIENT_ID = configElement.dataset.clientId;
const API_KEY = configElement.dataset.apiKey;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
let tokenClient;
let gapiInited = false;
let gisInited = false;

// Variable global para los eventos
let events = [];

// Variables globales para el calendario
let currentDate = new Date();
let selectedMonth = currentDate.getMonth();
let selectedYear = currentDate.getFullYear();

// Nombres de meses en español
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para cargar eventos desde el backend
async function loadEventsFromBackend() {
    try {
        console.log('Iniciando carga de eventos desde el backend...');
        const response = await fetch('/nuclea/api/events');
        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }
        
        const data = await response.json();
        console.log('Eventos recibidos del backend:', data);
        
        if (!Array.isArray(data) || data.length === 0) {
            console.log('No se encontraron eventos en el backend');
            return;
        }
        
        // Transformar los datos al formato que espera nuestro calendario
        events = data.map(event => {
            console.log('Procesando evento:', event);
            
            // Asegurarse de que las fechas sean strings válidos
            const fechaInicio = event.fechaInicio || new Date().toISOString().split('T')[0];
            const fechaFin = event.fechaFin || fechaInicio;
            
            // Crear fechas
            const startDate = new Date(fechaInicio);
            const endDate = new Date(fechaFin);
            
            // Verificar si las fechas son válidas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.error('Fechas inválidas para el evento:', event);
                return null;
            }
            
            // Si hay horas, agregarlas a las fechas
            if (event.horaInicio && !event.diaCompleto) {
                const [startHours, startMinutes] = event.horaInicio.split(':');
                startDate.setHours(parseInt(startHours), parseInt(startMinutes));
            }
            
            if (event.horaFin && !event.diaCompleto) {
                const [endHours, endMinutes] = event.horaFin.split(':');
                endDate.setHours(parseInt(endHours), parseInt(endMinutes));
            }
            
            // Mapear el tipo de evento
            let type, icon;
            switch(parseInt(event.tipoId)) {
                case 1:
                    type = "vacation";
                    icon = "🌙";
                    break;
                case 2:
                    type = "meeting";
                    icon = "👤";
                    break;
                case 3:
                    type = "holiday";
                    icon = "📌";
                    break;
                case 4:
                    type = "non-working";
                    icon = "🏠";
                    break;
                default:
                    type = "other";
                    icon = "📅";
            }
            
            const processedEvent = {
                id: event.eventoId,
                title: event.titulo,
                type: type,
                start: startDate,
                end: endDate,
                icon: icon,
                allDay: Boolean(event.diaCompleto),
                description: event.descripcion
            };
            
            console.log('Evento procesado:', processedEvent);
            return processedEvent;
        }).filter(Boolean); // Eliminar eventos nulos (con fechas inválidas)
        
        console.log('Total de eventos procesados:', events.length);
        console.log('Eventos finales:', events);
        
        // Actualizar la interfaz
        generateCalendar(selectedMonth, selectedYear);
        generateUpcomingEvents();
        updateStats();
        initializeAccordion();
        
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        alert('Error al cargar los eventos. Por favor recarga la página.');
    }
}

// Función para inicializar la aplicación
function init() {
    loadEventsFromBackend().then(() => {
        generateCalendar(selectedMonth, selectedYear);
        generateUpcomingEvents();
        updateStats();
    });
}

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

// Añadir el evento de clic al botón de sincronización
document.querySelector('.sync-button').addEventListener('click', handleCalendarSync);

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

// Función para obtener eventos de Google Calendar
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

// Función para procesar los eventos de Google Calendar
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
function getEventsForDay(day, month, year) {
    console.log(`Buscando eventos para el día ${day}/${month + 1}/${year}`);
    const targetDate = new Date(year, month, day);
    console.log('Fecha objetivo:', targetDate);
    
    const eventsForDay = events.filter(event => {
        // Crear copias de las fechas para no modificar los objetos originales
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        
        // Normalizar las fechas (quitar horas/minutos)
        const normalizedStart = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
        const normalizedEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
        const normalizedTarget = new Date(year, month, day);
        
        // Un evento ocurre en este día si:
        // 1. Es un evento de día completo y el día objetivo está entre la fecha de inicio y fin
        // 2. Es un evento con hora específica y comienza en este día
        const isInRange = normalizedTarget >= normalizedStart && normalizedTarget <= normalizedEnd;
        
        console.log(`Evaluando evento "${event.title}":`, {
            start: normalizedStart,
            end: normalizedEnd,
            target: normalizedTarget,
            isInRange: isInRange
        });
        
        return isInRange;
    });
    
    console.log(`Encontrados ${eventsForDay.length} eventos para el día ${day}/${month + 1}/${year}:`, eventsForDay);
    return eventsForDay;
}

// Función para generar el calendario
function generateCalendar(month, year) {
    console.log(`Generando calendario para ${monthNames[month]} ${year}`);
    
    document.querySelector(".month-title").textContent = `${monthNames[month]} ${year}`;
    
    const daysContainer = document.querySelector(".days");
    daysContainer.innerHTML = "";
    
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Días del mes anterior
    for (let i = 0; i < startingDay; i++) {
        const day = prevMonthLastDay - startingDay + i + 1;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day", "empty-day");
        
        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);
        
        daysContainer.appendChild(dayDiv);
    }
    
    // Días del mes actual
    const today = new Date();
    for (let i = 1; i <= totalDays; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        
        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = i;
        dayDiv.appendChild(dayNumber);
        
        // Verificar si es hoy
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add("today");
        }
        
        // Obtener eventos para este día
        const dayEvents = getEventsForDay(i, month, year);
        console.log(`Día ${i}: ${dayEvents.length} eventos encontrados`);
        
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement("div");
            eventsContainer.classList.add("day-events");
            
            // Crear tooltip container
            const tooltipContainer = document.createElement("div");
            tooltipContainer.classList.add("event-tooltip");
            
            // Agregar cada evento al tooltip
            dayEvents.forEach(event => {
                const tooltipItem = document.createElement("div");
                tooltipItem.classList.add("event-tooltip-item");
                
                const tooltipTitle = document.createElement("div");
                tooltipTitle.classList.add("event-tooltip-title");
                tooltipTitle.textContent = event.title;
                
                const tooltipTime = document.createElement("div");
                tooltipTime.classList.add("event-tooltip-time");
                tooltipTime.textContent = event.allDay ? "All day" : `${formatTime(event.start)} - ${formatTime(event.end)}`;
                
                tooltipItem.appendChild(tooltipTitle);
                tooltipItem.appendChild(tooltipTime);
                tooltipContainer.appendChild(tooltipItem);
            });
            
            // Mostrar hasta 2 eventos en el día
            dayEvents.slice(0, 2).forEach(event => {
                const eventTag = document.createElement("div");
                eventTag.classList.add("day-event-tag");
                
                // Agregar clases y estilos según el tipo de evento
                switch(event.type) {
                    case "vacation":
                        eventTag.classList.add("vacation");
                        dayDiv.classList.add("vacation-day");
                        eventTag.textContent = "Vacation";
                        break;
                    case "meeting":
                        eventTag.classList.add("meeting");
                        const shortTitle = event.title;
                        eventTag.textContent = shortTitle;
                        break;
                    case "holiday":
                        eventTag.classList.add("holiday");
                        dayDiv.classList.add("holiday-day");
                        eventTag.textContent = "Holiday";
                        break;
                    case "non-working":
                        eventTag.classList.add("non-working");
                        dayDiv.classList.add("non-working-day");
                        eventTag.textContent = "Non-working";
                        break;
                }
                
                eventsContainer.appendChild(eventTag);
            });
            
            // Mostrar indicador de más eventos si hay más de 2
            if (dayEvents.length > 2) {
                const moreEvents = document.createElement("div");
                moreEvents.classList.add("more-events");
                moreEvents.textContent = `+${dayEvents.length - 2} more`;
                eventsContainer.appendChild(moreEvents);
            }
            
            dayDiv.appendChild(tooltipContainer);
            dayDiv.appendChild(eventsContainer);
        }
        
        daysContainer.appendChild(dayDiv);
    }
    
    // Días del mes siguiente
    const remainingDays = 35 - (startingDay + totalDays); // 6 filas completas
    for (let i = 1; i <= remainingDays; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day", "empty-day");
        
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
    // Mantener el título
    const title = container.querySelector("h2");
    container.innerHTML = "";
    container.appendChild(title);
    
    const now = new Date();
    const today = now.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Calcular el inicio y fin de la semana actual
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Retroceder al domingo
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Avanzar al sábado
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Si es viernes (5), mostrar eventos de la próxima semana
    if (today === 5) {
        startOfWeek.setDate(startOfWeek.getDate() + 7);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
    }
    
    // Filtrar eventos que ocurren en el rango de fechas seleccionado
    const weekEvents = events
        .filter(event => {
            const eventStart = new Date(event.start);
            return eventStart >= startOfWeek && eventStart <= endOfWeek;
        })
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Actualizar el título según la semana que se muestra
    title.textContent = today === 5 ? "Next Week's Events" : "This Week's Events";
    
    // Generar HTML para cada evento
    weekEvents.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-item");
        
        let eventTagClass = "";
        let eventType = "";
        switch(event.type) {
            case "vacation":
                eventTagClass = "vacation";
                eventType = "Vacation";
                break;
            case "meeting":
                eventTagClass = "meeting";
                eventType = "Meeting";
                break;
            case "holiday":
                eventTagClass = "holiday";
                eventType = "Holiday";
                break;
            case "non-working":
                eventTagClass = "non-working";
                eventType = "Non-working";
                break;
            default:
                eventType = "Event";
        }
        
        // Generar la información del horario
        let timeInfo = event.allDay ? "All day" : `${formatTime(event.start)} - ${formatTime(event.end)}`;
        
        eventItem.innerHTML = `
            <div class="event-title">
                <span class="event-icon ${eventTagClass}">${event.icon}</span>
                <div class="event-details">
                    <div>${event.title}</div>
                    <div class="event-date">
                        <span><i class="fa-regular fa-calendar"></i> ${formatDate(event.start)}</span>
                        <span style="margin-left: 10px;"><i class="fa-regular fa-clock"></i> ${timeInfo}</span>
                    </div>
                </div>
            </div>
            <span class="event-tag ${eventTagClass}">${eventType}</span>
        `;
        
        container.appendChild(eventItem);
    });
    
    // Si no hay eventos para mostrar
    if (weekEvents.length === 0) {
        const noEvents = document.createElement("p");
        noEvents.textContent = "No events scheduled for this " + (today === 5 ? "next" : "") + " week";
        container.appendChild(noEvents);
    }
}

// Función para actualizar estadísticas
function updateStats() {
    try {
        // Contar reuniones one-to-one
        const oneToOneElement = document.querySelector(".circle.meeting");
        if (oneToOneElement) {
            const oneToOneCount = events.filter(e => e.type === "meeting").length;
            oneToOneElement.textContent = oneToOneCount;
        }
        
        // Contar días de vacaciones
        const vacationElement = document.querySelector(".circle.vacation");
        if (vacationElement) {
            let vacationDays = 0;
            events.filter(e => e.type === "vacation").forEach(vacation => {
                const start = new Date(vacation.start);
                const end = new Date(vacation.end);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                vacationDays += diffDays;
            });
            vacationElement.textContent = vacationDays;
        }
        
        // Contar días festivos
        const holidayElement = document.querySelector(".circle.holiday");
        if (holidayElement) {
            const holidayCount = events.filter(e => e.type === "holiday").length;
            holidayElement.textContent = holidayCount;
        }

        // Contar días no laborables
        const nonWorkingElement = document.querySelector(".circle.non-working");
        if (nonWorkingElement) {
            const nonWorkingCount = events.filter(e => e.type === "non-working").length;
            nonWorkingElement.textContent = nonWorkingCount;
        }
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
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

// Asegurar que la aplicación se inicie correctamente
document.addEventListener('DOMContentLoaded', function() {
    init();
    initializeAccordion();

    // Delegación de eventos para el acordeón
    const statisticsContainer = document.querySelector('.statistics-container');
    if (statisticsContainer) {
        statisticsContainer.addEventListener('click', function(e) {
            const header = e.target.closest('.category-header');
            if (header) {
                e.preventDefault();
                e.stopPropagation();
                toggleAccordionItem(header);
            }
        });
    }

    if (document.querySelector('.sync-button')) {
        loadGoogleAPIs();
    }
});

// Manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error global capturado:', event.error);
});

// Manejar promesas rechazadas no manejadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promesa rechazada no manejada:', event.reason);
});

// ----------sidebar.js----------
// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  initializeAccordion();
});

// Función para inicializar el acordeón
function initializeAccordion() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    console.log('Headers encontrados:', categoryHeaders.length);

    // Remover listeners existentes primero
    categoryHeaders.forEach(header => {
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
    });

    // Actualizar la referencia después de clonar
    const newHeaders = document.querySelectorAll('.category-header');

    // Cerrar todos los paneles primero
    document.querySelectorAll('.category-details').forEach(details => {
        details.classList.add('collapsed');
    });

    // Abrir el primer panel por defecto
    if (newHeaders.length > 0) {
        const firstHeader = newHeaders[0];
        const firstDetails = firstHeader.nextElementSibling;
        firstHeader.classList.add('active');
        if (firstDetails) {
            firstDetails.classList.remove('collapsed');
        }
    }
}

// Función para alternar el estado de un elemento del acordeón
function toggleAccordionItem(header) {
    if (!header) return;
    
    const isActive = header.classList.contains('active');
    const details = header.nextElementSibling;
    
    // Cerrar todos los paneles primero
    document.querySelectorAll('.category-header').forEach(h => {
        h.classList.remove('active');
        const d = h.nextElementSibling;
        if (d) {
            d.classList.add('collapsed');
        }
    });

    // Si no estaba activo, abrir el panel seleccionado
    if (!isActive) {
        header.classList.add('active');
        if (details) {
            details.classList.remove('collapsed');
        }
    }
}

// Helper para manejar la altura del contenedor si es necesario
function adjustContainerHeight() {
    const container = document.querySelector('.statistics-container');
    const activeDetails = document.querySelector('.category-details:not(.collapsed)');
    
    if (container && activeDetails) {
        const minHeight = 400;
        const contentHeight = activeDetails.scrollHeight + 200;
        container.style.minHeight = `${Math.max(minHeight, contentHeight)}px`;
    }
}

// Si estás usando Handlebars en el cliente para renderizar dinámicamente
function renderHandlebarsContent(data) {
  // Este es un ejemplo de cómo podrías manejar la renderización con Handlebars
  // Asumiendo que tienes una plantilla y datos listos
  // Después de renderizar, inicializa el acordeón
  initializeAccordion();
}