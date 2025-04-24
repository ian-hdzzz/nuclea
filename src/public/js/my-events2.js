// Modificación del JavaScript para mostrar eventos de la base de datos
// ===================================================================

// Variables globales
let currentDate = new Date();
let selectedMonth = currentDate.getMonth();
let selectedYear = currentDate.getFullYear();
let events = []; // Ahora lo cargaremos desde el backend

// Nombre de los meses
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Colores de tipos de eventos (traídos de la tabla tipo)
const eventTypeColors = {
    1: "#3B82F6", // Vacaciones
    2: "#8B5CF5", // One-to-one
    3: "#21C55E", // Holidays (Festivos)
    4: "#6C7280"  // Non-working-days (Días no laborables)
};

// Función para cargar los eventos desde el backend
async function loadEventsFromBackend() {
    try {
        // Esto se reemplazaría por una llamada real a tu API
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }
        
        const data = await response.json();
        
        // Transformar los datos al formato que espera nuestro calendario
        events = data.map(event => {
            // Crear fechas de inicio y fin
            const startDate = new Date(event.fechaInicio.replace('0000-00-00', `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`));
            startDate.setHours(
                parseInt(event.horaInicio.split(':')[0]),
                parseInt(event.horaInicio.split(':')[1]) || 0
            );
            
            const endDate = new Date(event.fechaFin.replace('0000-00-00', `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`));
            endDate.setHours(
                parseInt(event.horaFin.split(':')[0]),
                parseInt(event.horaFin.split(':')[1]) || 0
            );
            
            // Determinar el icono basado en el tipo
            let icon = "📌"; // Por defecto
            if (event.tipoId === 1) icon = "🌙"; // Vacaciones
            if (event.tipoId === 2) icon = "👤"; // One-to-one
            
            // Crear el objeto de evento en el formato esperado
            return {
                id: event.eventId,
                title: event.titulo,
                type: event.tipoId,
                start: startDate,
                end: endDate,
                icon: icon,
                allDay: true, // Ajustar según tus datos
                description: event.descripcion,
                color: eventTypeColors[event.tipoId] || "#6C7280" // Color por defecto si no hay coincidencia
            };
        });
        
        console.log('Eventos cargados:', events);
        
        // Actualizar la interfaz
        generateCalendar(selectedMonth, selectedYear);
        generateUpcomingEvents();
        updateStats();
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        alert('Error al cargar los eventos. Por favor recarga la página.');
    }
}

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
    const targetDate = new Date(year, month, day);
    
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
            dayEvents.forEach(event => {
                // Aplicar estilos según el tipo de evento
                if (event.type === 1) dayDiv.classList.add("vacation-day");
                if (event.type === 3) dayDiv.classList.add("holiday-day");
                if (event.type === 4) dayDiv.classList.add("non-working-day");
            });
            
            // Create event indicators
            const eventsContainer = document.createElement("div");
            eventsContainer.classList.add("day-events");
            
            // Mostrar hasta 2 eventos
            dayEvents.slice(0, 2).forEach(event => {
                const eventTag = document.createElement("div");
                eventTag.classList.add("day-event-tag");
                
                // Add class based on event type
                eventTag.classList.add(`type-${event.type}`);
                eventTag.style.backgroundColor = event.color;
                
                const shortTitle = event.title.length > 10 ? 
                                event.title.substring(0, 8) + "..." : 
                                event.title;
                eventTag.textContent = shortTitle;
                
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
    const remainingDays = 42 - (startingDay + totalDays); // 6 rows of 7 days
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
    // Mantener el título
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
        
        // Determinar la clase del tag según el tipo
        let eventTagClass = "";
        if (event.type === 1) eventTagClass = "vacation";
        if (event.type === 3) eventTagClass = "holiday";
        if (event.type === 4) eventTagClass = "non-working-day";
        
        let dateInfo;
        if (event.allDay) {
            if (event.start.getTime() === event.end.getTime()) {
                dateInfo = `<span><i class="fa-regular fa-calendar"></i> ${formatDate(event.start)}</span>`;
            } else {
                dateInfo = `<span><i class="fa-regular fa-calendar"></i> ${formatDate(event.start)} - ${formatDate(event.end)}</span>`;
            }
        } else {
            dateInfo = `<span><i class="fa-regular fa-calendar"></i> ${formatDate(event.start)}</span><span style="margin-left: 10px;"><i class="fa-regular fa-clock"></i> ${formatTime(event.start)} - ${formatTime(event.end)}</span>`;
        }
        
        // Determinar el nombre del tipo según el id
        let typeName = "Evento";
        if (event.type === 1) typeName = "Vacaciones";
        if (event.type === 2) typeName = "One-to-One";
        if (event.type === 3) typeName = "Festivo";
        if (event.type === 4) typeName = "No laborable";
        
        eventItem.innerHTML = `
            <div class="event-title">
                <span class="event-icon ${eventTagClass}">${event.icon}</span>
                <div class="event-details">
                    <div>${event.title}</div>
                    <div class="event-date">
                        ${dateInfo}
                    </div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                </div>
            </div>
            <span class="event-tag ${eventTagClass}" style="background-color: ${event.color}">${typeName}</span>
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
    // Contar one-to-one (tipo 2)
    const oneToOneCount = events.filter(e => e.type === 2).length;
    document.querySelector(".stat-count").textContent = oneToOneCount;
    
    // Contar días de vacaciones (tipo 1)
    let vacationDays = 0;
    events.filter(e => e.type === 1).forEach(vacation => {
        const start = new Date(vacation.start);
        const end = new Date(vacation.end);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el día final
        vacationDays += diffDays;
    });
    document.querySelector(".stat-count.purple").textContent = vacationDays;
    
    // Contar días festivos (tipo 3)
    const holidayCount = events.filter(e => e.type === 3).length;
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

// Inicializar la aplicación
function init() {
    // Cargar eventos desde el backend
    loadEventsFromBackend();
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);

  // --------------------sidebar--------------------
  // my-events-sidebar.js
  document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to event type headers
    const eventTypeHeaders = document.querySelectorAll('.event-type-header');
    
    eventTypeHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const eventTypeId = this.getAttribute('data-event-type');
        const eventList = document.getElementById(`event-list-${eventTypeId}`);
        
        // Toggle active class on header
        this.classList.toggle('active');
        
        // Toggle visibility of event list
        if (eventList.classList.contains('hidden')) {
          eventList.classList.remove('hidden');
          setTimeout(() => {
            eventList.classList.add('show');
          }, 10);
        } else {
          eventList.classList.remove('show');
          eventList.addEventListener('transitionend', function handler() {
            eventList.classList.add('hidden');
            eventList.removeEventListener('transitionend', handler);
          });
        }
      });
    });
  });