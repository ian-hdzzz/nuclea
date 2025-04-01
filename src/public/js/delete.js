function confirmDelete(idSolicitud) {
    const confirmed = confirm("Are you sure you want to delete this request?");
    if (confirmed) {
        //Funcion propia de JS para mandar algun metodo
        fetch(`/nuclea/delete/${idSolicitud}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.ok) {
                alert("Request deleted successfully.");
                location.reload(); // Recarga la página o actualiza la lista si es necesario
            } else {
                alert("Error deleting request.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    }
}