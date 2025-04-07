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
            return res.json();
        })
        
        .then(data => {
            
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    } 
}