const btn_buscar = document.getElementById("search-input");

btn_buscar.addEventListener("keyup", () => {
    const query = btn_buscar.value.trim();
    


    fetch(`/nuclea/holiday/search?name=${encodeURIComponent(query)}`, { 
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        updateResults(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function formatDate(dateString) {
    // Implementa tu lógica de formato aquí
    return dateString;
}

function updateResults(data) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    if (data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.Nombre_asueto}</td>
                <td>${formatDate(item.Fecha_asueto)}</td>
                <td>
                    <div class="dropdown">
                        <button class="action-btn">Actions</button>
                        <div class="dropdown-content">
                            <button class="edit-btn" onclick="location.href='/nuclea/holiday/update/${item.idHoliday}'">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button class="delete-btn" onclick="location.href='/nuclea/holiday/delete/${item.idHoliday}'">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align:center;">No results found</td>`;
        tbody.appendChild(row);
    }
}