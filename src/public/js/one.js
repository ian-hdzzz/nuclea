
document.addEventListener('DOMContentLoaded', function() {
// Get reference to tableCollab div
const tableCollabDiv = document.querySelector('.tableCollab');

// Create radar chart functionality
let radarChart; // Keep the radarChart variable for backward compatibility

// Function that can be safely called multiple times to initialize or update the chart
function initOrUpdateRadarChart(containerId = 'radar-chart', graphData = null) {
    // Get the canvas element
    const canvas = document.getElementById(containerId);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    
    // Check if this canvas already has a chart associated with it
    let existingChart = Chart.getChart(canvas);
    
    // Get the container that holds data attributes
    const container = canvas.closest('.chart-container');
    if (!container) return null;
    
    // Get data from data attributes or from passed graphData
    function getValue(name, fallbackSelectorName) {
        // If graphData is provided, use it first
        if (graphData && graphData[name] !== undefined) {
            return parseFloat(graphData[name]);
        }
        
        // Otherwise try to get from data attributes
        const value = container.dataset[name];
        if (value !== undefined && value !== '') return parseFloat(value);
        
        // Finally, try to get from form elements
        const el = document.getElementsByName(fallbackSelectorName)[0];
        return el ? parseFloat(el.value) : 0;
    }
    
    const workload = getValue('workload', 'workload');
    const health = getValue('health', 'health');
    const recognition = getValue('recognition', 'recognition');
    const emotionalHealth = graphData ? getValue('emotionalHealth', 'emotional-health') : getValue('emotional', 'emotional-health');
    const workLifeBalance = graphData ? getValue('workLifeBalance', 'work-life-balance') : getValue('balance', 'work-life-balance');
    
    const dataValues = [workload, health, recognition, emotionalHealth, workLifeBalance];
    const average = dataValues.reduce((a, b) => a + b, 0) / dataValues.length;
    
    // Determine color based on average
    let color;
    if (average <= 1.5) color = 'rgba(255, 0, 0';
    else if (average <= 2.5) color = 'rgba(255, 215, 0';
    else if (average <= 3.5) color = 'rgba(0, 128, 0';
    else color = 'rgba(4, 205, 250';
    
    const chartConfig = {
        type: 'radar',
        data: {
            labels: [
                'Workload',
                'Health',
                'Recognition',
                'Emotional Health',
                'Work-Life Balance'
            ],
            datasets: [{
                label: 'Employee Metrics',
                data: dataValues,
                backgroundColor: `${color}, 0.5)`,
                borderColor: `${color}, 0.8)`,
                pointBackgroundColor: `${color}, 1)`,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: `${color}, 1)`
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        display: true,
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'rgba(0, 0, 0, 0.8)',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    
    // If there's already a chart, update it
    if (existingChart) {
        existingChart.data.datasets[0].data = dataValues;
        existingChart.data.datasets[0].backgroundColor = `${color}, 0.5)`;
        existingChart.data.datasets[0].borderColor = `${color}, 0.8)`;
        existingChart.data.datasets[0].pointBackgroundColor = `${color}, 1)`;
        existingChart.data.datasets[0].pointHoverBorderColor = `${color}, 1)`;
        existingChart.update();
        
        // Update radarChart reference for backward compatibility
        radarChart = existingChart;
        return existingChart;
    }
    
    // Otherwise create a new chart
    const newChart = new Chart(ctx, chartConfig);
    
    // Store reference for backward compatibility
    radarChart = newChart;
    return newChart;
}

// Make this function global so it can be called from anywhere
window.initOrUpdateRadarChart = initOrUpdateRadarChart;

// Initialize the chart on page load if it exists on the page
if (document.getElementById('radar-chart')) {
    const chart = initOrUpdateRadarChart();
}

// Keep the original updateGraphWithData function for backward compatibility
window.updateGraphWithData = function(graphData) {
    if (!graphData) return;
    
    const container = document.querySelector('.chart-container');
    if (!container) {
        console.error('Chart container not found');
        return;
    }
    
    // Update data attributes
    container.dataset.workload = graphData.workload;
    container.dataset.health = graphData.health;
    container.dataset.recognition = graphData.recognition;
    container.dataset.emotional = graphData.emotionalHealth;
    container.dataset.balance = graphData.workLifeBalance;
    
    // Update or initialize the chart
    initOrUpdateRadarChart('radar-chart', graphData);
};

// Function to initialize the radar chart with provided data
function initializeRadarChart(graphData) {
    return initOrUpdateRadarChart('radar-chart', graphData);
}

// Handle select changes if in edit mode
const selects = document.querySelectorAll('select[name="workload"], select[name="health"], select[name="recognition"], select[name="emotional-health"], select[name="work-life-balance"]');
selects.forEach(select => {
    select.addEventListener('change', function() {
        initOrUpdateRadarChart();
    });
});

// Load all completed interviews by default
loadAllInterviews();

// Load default graph
updateEmployeeGraph(null);

const searchInput = document.getElementById('employeeSearch');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            loadAllInterviews();
            updateEmployeeGraph(null);
            //Restaurar el título
            const graphTitle = document.querySelector('.card.graph h3');
            if (graphTitle) {
                graphTitle.textContent = 'Team Performance Overview';
            }
        }
    });
}

// Function to load all interviews
function loadAllInterviews() {
    // Show loading indicator
    if (tableCollabDiv) {
        tableCollabDiv.innerHTML = '<div class="loading">Loading interview history...</div>';
        
        // Fetch all completed interviews
        fetch('/nuclea/all-interviews')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderAllInterviews(data.interviews);
                } else {
                    tableCollabDiv.innerHTML = `<div class="error">Error: ${data.message}</div>`;
                }
            })
            .catch(error => {
                console.error('Error fetching interviews:', error);
                tableCollabDiv.innerHTML = '<div class="error">Error loading interview data. Please try again.</div>';
            });
    }
}

// Function to render all interviews
function renderAllInterviews(interviews) {
    // Format date for better display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    let html = `
        <div class="interviews-container">
            <div class="interviews-header">
                <h2>All Completed Interviews</h2>
                <p>Showing all completed interviews across all employees</p>
            </div>
            
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Interviewer</th>
                        <th>Employee </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (interviews && interviews.length > 0) {
        // Add each interview to the table
        interviews.forEach(interview => {
            console.log("Interview data:", interview.id); // Para ver si el campo id existe
            const interviewerName = `${interview.entrevistadorNombre || ''} ${interview.entrevistadorApellidos || ''}`.trim();
            html += `
                <tr>
                    <td>${formatDate(interview.fechaEntrevista)}</td>
                    <td>${interviewerName || 'Unknown'}</td>
                    <td>${interview.empleadoNombre}</td>
                    <td>
                        <button class="btn-view" data-id="${interview.id || ''}" onclick="viewInterviewDetails('${interview.id || ''}')">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="4" class="no-data">No interview records found</td>
            </tr>
        `;
    }
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    // Update the tableCollab div with the HTML
    if (tableCollabDiv) {
        tableCollabDiv.innerHTML = html;
        
        // Add event listeners to the view details buttons
        const viewButtons = tableCollabDiv.querySelectorAll('.btn-view');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const interviewId = this.getAttribute('data-id');
                console.log("Navigating to interview details with ID:", interviewId);
                if (interviewId) {
                    window.location.href = `/nuclea/interview/details/${interviewId}`;
                } else {
                    console.error("No interview ID found on button");
                    // Handle the error case
                }
            });
        });
    }
}

// Listen for contact-selected event
document.addEventListener('contact-selected', function(event) {
    const employeeId = event.detail.id;
    const employeeName = event.detail.name;

    const graphTitle = document.getElementById('graph-title');
    if (graphTitle) {
        graphTitle.textContent = employeeName 
            ? `${employeeName} Performance Overview` 
            : 'Team Performance Overview';
    }
    if (employeeId) {
        // Show loading indicator
        if (tableCollabDiv) {
            tableCollabDiv.innerHTML = '<div class="loading">Loading employee data...</div>';
            
            console.log("Fetching employee history for ID:", employeeId);
            // Fetch employee history
            fetch(`/nuclea/employee-history/${employeeId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        renderEmployeeData(data.employee, data.interviewHistory);
                        
                        // Now fetch and update the graph with employee's metrics
                        updateEmployeeGraph(employeeId);
                    } else {
                        tableCollabDiv.innerHTML = `<div class="error">Error: ${data.message}</div>`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching employee data:', error);
                    tableCollabDiv.innerHTML = '<div class="error">Error loading employee data. Please try again.</div>';
                });
        }
    } else {
        // If no employee selected, show all interviews
        loadAllInterviews();
        
        // Reset graph to default (all employees)
        updateEmployeeGraph(null);
        const graphTitle = document.getElementById('graph-title');
        if (graphTitle) {
            graphTitle.textContent = 'Team Performance Overview';
        }
    }
});

// Function to update the graph with employee data
async function updateEmployeeGraph(employeeId) {
    const url = employeeId ? `/nuclea/employee-graph/${employeeId}` : '/nuclea/all-employees-graph';
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        console.log('Graph data received:', data); // Debug log
        
        if (data.success) {
            // Use the global updateGraphWithData function
            updateGraphWithData(data.graphData);
        } else {
            console.error('Error in graph data response:', data.message);
        }
    } catch (error) {
        console.error('Error fetching graph data:', error);
    }
}

// Function to render employee data and interview history
function renderEmployeeData(employee, interviewHistory) {
    // Format date for better display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    // Calculate time in company
    let timeInCompany = 'N/A';
    if (employee.fechaInicio) {
        const startDate = new Date(employee.fechaInicio);
        const currentDate = new Date();
        
        const years = currentDate.getFullYear() - startDate.getFullYear();
        const months = currentDate.getMonth() - startDate.getMonth();
        const days = currentDate.getDate() - startDate.getDate();
        
        timeInCompany = `${years} años, ${months < 0 ? months + 12 : months} meses, ${days < 0 ? days + 30 : days} días`;
    }
    
    // Build employee profile section
    let html = `
        <div class="employee-profile one">
            <div class="profile-header">
                <div class="employee-avatar">${employee.initial}</div>
                <div class="employee-info">
                    <h2>${employee.nombre} ${employee.apellidos}</h2>
                    <p class="employee-position">${employee.puesto || 'No position specified'}</p>
                    <p class="employee-department">Modality: ${employee.modalidad || 'No modality specified'}</p>
                </div>
            </div>
            <div class="profile-details">
                <p><strong>Start Date:</strong> ${formatDate(employee.fechaInicio)}</p>
                <p><strong>Time in Company:</strong> ${timeInCompany}</p>
            </div>
            
        </div>
    `;
    
    // Add interview history section if available
    if (interviewHistory && interviewHistory.length > 0) {
        html += `
            <div class="interview-history">
                <h3>Interview History for ${employee.nombre}</h3>
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Interviewer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add each interview to the table
        interviewHistory.forEach(interview => {
            const interviewerName = `${interview.entrevistadorNombre || ''} ${interview.entrevistadorApellidos || ''}`.trim();
            html += `
                <tr>
                    <td>${formatDate(interview.fechaEntrevista)}</td>
                    <td>${interviewerName || 'Unknown'}</td>
                    <td>${interview.completada ? 'Completed' : 'In Progress'}</td>
                    <td>
                        <button class="btn-view" data-id="${interview.id}" data-employee="${employee.id}">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    } else {
        html += `
            <div class="no-interviews">
                <p>No interview history available for this employee.</p>
            </div>
        `;
    }
    
    // Update the tableCollab div with the HTML
    if (tableCollabDiv) {
        tableCollabDiv.innerHTML = html;
        
        // Add event listener to view details buttons
        const viewButtons = tableCollabDiv.querySelectorAll('.btn-view');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const interviewId = this.getAttribute('data-id');
                window.location.href = `/nuclea/interview/details/${interviewId}`;
            });
        });
    }
}
});



