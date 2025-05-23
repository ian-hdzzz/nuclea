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
        this.scheduleButton = document.querySelector('.popup-buttons .button.is-info');

        this.initializeFlatpickr();
        this.setupEventListeners();
        this.setupScheduleButton();
        this.setupTimePicker();
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
        // Configure the search container
        if (this.searchContainer) {
            this.searchContainer.setAttribute('data-in-popup', 'true');
        }

        // Handle popup close
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

        // Handle time selector
        this.timeInput.addEventListener('click', () => {
            this.timeDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!this.timeInput.contains(event.target) && !this.timeDropdown.contains(event.target)) {
                this.timeDropdown.classList.remove('active');
            }
        });

        // Configure time options
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

        // Handle user selection
        document.addEventListener('contact-selected', (event) => {
            if (event.detail.searchId === 'employeeSearchPopup') {
                this.handleUserSelection(event.detail);
            }
        });
    }

    setupScheduleButton() {
        if (this.scheduleButton) {
            this.scheduleButton.addEventListener('click', async () => {
                if (!this.selectedUser) {
                    alert('Please select a team member');
                    return;
                }

                const selectedDate = this.datePicker.selectedDates[0];
                if (!selectedDate) {
                    alert('Please select a date');
                    return;
                }

                const dateStr = selectedDate.toISOString().split('T')[0];
                const timeStr = this.timeInput.value;
                
                try {
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                    
                    const response = await fetch('/nuclea/agendar-one-to-one', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': csrfToken
                        },
                        body: JSON.stringify({
                            selectedUserId: this.selectedUser.id,
                            date: dateStr,
                            time: timeStr,
                            titulo: "One-to-one",
                            _csrf: csrfToken
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        alert('Meeting scheduled successfully!');
                        this.close();
                        window.location.reload();
                    } else {
                        alert(data.message || 'Failed to schedule meeting');
                    }
                } catch (error) {
                    console.error('Error scheduling meeting:', error);
                    alert('An error occurred while scheduling the meeting');
                }
            });
        }
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

    setupTimePicker() {
        // Time picker functionality
        const timeInput = this.timeInput;
        const timeDropdown = this.timeDropdown;

        // Show/hide time dropdown
        timeInput.addEventListener('click', () => {
            timeDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!timeInput.contains(e.target) && !timeDropdown.contains(e.target)) {
                timeDropdown.classList.remove('show');
            }
        });

        // Handle time selection
        timeDropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-option')) {
                const hour = e.target.closest('.hours-column') ? e.target.textContent : timeInput.value.split(':')[0];
                const minute = e.target.closest('.minutes-column') ? e.target.textContent : timeInput.value.split(':')[1];
                timeInput.value = `${hour}:${minute}`;
                
                // Update selected state
                const options = timeDropdown.getElementsByClassName('time-option');
                Array.from(options).forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });

        // Allow manual input with validation
        timeInput.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // Remove non-numeric characters except colon
            value = value.replace(/[^\d:]/g, '');
            
            // Format as HH:MM
            if (value.length > 2 && !value.includes(':')) {
                value = value.substring(0, 2) + ':' + value.substring(2);
            }
            
            // Validate hours and minutes
            const [hours, minutes] = value.split(':');
            if (hours && parseInt(hours) > 23) {
                value = '23' + (value.includes(':') ? ':' + (minutes || '00') : '');
            }
            if (minutes && parseInt(minutes) > 59) {
                value = (hours || '00') + ':59';
            }
            
            e.target.value = value;
        });
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

// Export the class for global use
window.SchedulePopup = SchedulePopup;