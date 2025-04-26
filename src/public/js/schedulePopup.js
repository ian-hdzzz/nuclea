class SchedulePopup {
    constructor() {
        this.popupOverlay = document.getElementById('popupOverlay');
        this.closePopupBtn = document.getElementById('closePopupBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.timeInput = document.getElementById('timeInput');
        this.timeDropdown = document.getElementById('timeDropdown');
        this.dateInput = document.getElementById('dateInput');
        this.searchContainer = document.querySelector('#search-container-employeeSearchPopup');
        this.searchInput = document.querySelector('#employeeSearchPopup');
        this.selectedUser = null;

        this.initializeFlatpickr();
        this.setupEventListeners();
    }

    initializeFlatpickr() {
        this.datePicker = flatpickr(this.dateInput, {
            dateFormat: "F j, Y",
            disableMobile: true,
            minDate: "today",
            theme: "dark",
            inline: false,
            onChange: (selectedDates, dateStr) => {
                this.dateInput.innerHTML = `
                    <span class="calendar-icon"><i class="fas fa-calendar"></i></span>
                    <span>${dateStr}</span>
                `;
            },
            onOpen: () => {
                setTimeout(() => {
                    const calendar = document.querySelector('.flatpickr-calendar');
                    if (calendar) {
                        calendar.style.backgroundColor = '#0B1019';
                        calendar.style.color = 'white';
                        calendar.style.borderColor = '#2C3E50';
                    }
                }, 0);
            }
        });
    }

    setupEventListeners() {
        // Configurar el contenedor de búsqueda
        if (this.searchContainer) {
            this.searchContainer.setAttribute('data-in-popup', 'true');
        }

        // Manejo de cierre del popup
        if (this.closePopupBtn) {
            this.closePopupBtn.addEventListener('click', () => this.close());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }

        if (this.popupOverlay) {
            this.popupOverlay.addEventListener('click', (event) => {
                if (event.target === this.popupOverlay) {
                    this.close();
                }
            });
        }

        // Manejo del selector de tiempo
        this.timeInput.addEventListener('click', () => {
            this.timeDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!this.timeInput.contains(event.target) && !this.timeDropdown.contains(event.target)) {
                this.timeDropdown.classList.remove('active');
            }
        });

        // Configurar opciones de tiempo
        const timeOptions = document.querySelectorAll('.time-option');
        timeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const parent = option.parentElement;
                parent.querySelectorAll('.time-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                this.updateTimeInput();
            });
        });

        // Manejar selección de usuario
        document.addEventListener('contact-selected', (event) => {
            if (event.detail.searchId === 'employeeSearchPopup') {
                this.handleUserSelection(event.detail);
            }
        });
    }

    updateTimeInput() {
        const selectedHour = document.querySelector('.hours-column .selected').textContent;
        const selectedMinute = document.querySelector('.minutes-column .selected').textContent;
        const selectedPeriod = document.querySelector('.period-column .selected').textContent;
        this.timeInput.value = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    }

    handleUserSelection(detail) {
        const { id: userId, name: userName } = detail;

        if (this.selectedUser) {
            const existingTag = document.querySelector('.selected-user-tag');
            if (existingTag) {
                existingTag.remove();
            }
        }

        this.selectedUser = { id: userId, name: userName };

        const tag = document.createElement('div');
        tag.className = 'selected-user-tag';
        tag.dataset.userId = userId;
        tag.innerHTML = `
            <span>${userName}</span>
            <span class="remove-tag">✕</span>
        `;

        tag.querySelector('.remove-tag').addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectedUser = null;
            tag.remove();
            if (this.searchInput) {
                this.searchInput.value = '';
                this.searchInput.dispatchEvent(new Event('input'));
            }
        });

        const selectedUserTags = this.searchContainer.querySelector('.search-input-wrapper');
        selectedUserTags.insertBefore(tag, this.searchInput);

        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.dispatchEvent(new Event('input'));
        }
    }

    open() {
        if (this.popupOverlay) {
            this.popupOverlay.classList.add('active');
        }
    }

    close() {
        if (this.popupOverlay) {
            this.popupOverlay.classList.remove('active');
        }
    }
}

// Exportar la clase para uso global
window.SchedulePopup = SchedulePopup;