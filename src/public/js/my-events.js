
// const CLIENT_ID = GOOGLE_CLIENT_ID;
// const API_KEY = 'TU_API_KEY';
// const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// const SCOPES = "https://www.googleapis.com/auth/calendar.events";

// function handleClientLoad() {
//   gapi.load('client:auth2', initClient);
// }

// function initClient() {
//   gapi.client.init({
//     apiKey: API_KEY,
//     clientId: CLIENT_ID,
//     discoveryDocs: DISCOVERY_DOCS,
//     scope: SCOPES
//   }).then(() => {
//     const authInstance = gapi.auth2.getAuthInstance();

//     // Iniciar sesión al hacer clic
//     document.querySelector('.sync-button').addEventListener('click', () => {
//       if (!authInstance.isSignedIn.get()) {
//         authInstance.signIn().then(() => {
//           addEventsToGoogleCalendar();
//         });
//       } else {
//         addEventsToGoogleCalendar();
//       }
//     });
//   });
// }

// function addEventsToGoogleCalendar() {
//   events.forEach(event => {
//     const eventData = {
//       summary: event.title,
//       start: {
//         dateTime: event.start.toISOString()
//       },
//       end: {
//         dateTime: event.end.toISOString()
//       }
//     };
//     gapi.client.calendar.events.insert({
//       calendarId: 'primary',
//       resource: eventData
//     }).then(response => {
//       console.log('Evento creado: ', response);
//     });
//   });
// }

// handleClientLoad();// Definición de eventos (puedes personalizar estos según tus necesidades)
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
function getEventsForDay(day, month, year) {
    return events.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        
        // Verificar si es un evento de un solo día
        if (event.allDay && eventStart.getDate() === day && 
            eventStart.getMonth() === month && 
            eventStart.getFullYear() === year) {
            return true;
        }
        
        // Verificar si es un evento multidía
        if (event.allDay && event.type === 'vacation') {
            const checkDate = new Date(year, month, day);
            return checkDate >= eventStart && checkDate <= eventEnd;
        }
        
        // Verificar eventos normales
        return eventStart.getDate() === day && 
               eventStart.getMonth() === month && 
               eventStart.getFullYear() === year;
    });
}

// Función para generar el calendario


// Function to generate the calendar with events below numbers
function generateCalendar(month, year) {
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
        
        // Add day number at the top
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
        
        // Add day number at the top
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
            // Create event container to ensure proper ordering
            const eventsContainer = document.createElement("div");
            eventsContainer.style.width = "100%";
            eventsContainer.style.display = "flex";
            eventsContainer.style.flexDirection = "column";
            eventsContainer.style.alignItems = "center";
            
            // Add events to the container
            dayEvents.forEach(event => {
                const eventTag = document.createElement("div");
                eventTag.classList.add("day-event-tag");
                
                // Add class based on event type
                if (event.type === "meeting") {
                    eventTag.classList.add("meeting");
                    eventTag.innerHTML = `<i class="fa-regular fa-user-circle"></i> One-to-One...`;
                } else if (event.type === "vacation") {
                    eventTag.classList.add("vacation");
                    eventTag.innerHTML = `<i class="fa-regular fa-moon"></i> Vacaciones`;
                } else if (event.type === "holiday") {
                    eventTag.classList.add("holiday");
                    eventTag.innerHTML = `<i class="fa-solid fa-calendar-day"></i> ${event.title}`;
                }
                
                eventsContainer.appendChild(eventTag);
            });
            
            // Add events container below the number
            dayDiv.appendChild(eventsContainer);
        }
        
        daysContainer.appendChild(dayDiv);
    }
    
    // Days of the next month
    const remainingCells = 35 - (startingDay + totalDays); // 6 rows x 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.style.opacity = "0.5";
        
        // Add day number at the top
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
                dateInfo = `<span>📅 ${formatDate(event.start)}</span>`;
            } else {
                dateInfo = `<span>📅 ${formatDate(event.start)} - ${formatDate(event.end)}</span>`;
            }
        } else {
            dateInfo = `<span>📅 ${formatDate(event.start)}</span><span style="margin-left: 10px;">⌚ ${formatTime(event.start)} - ${formatTime(event.end)}</span>`;
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

