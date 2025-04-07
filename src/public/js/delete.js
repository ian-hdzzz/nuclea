function confirmDeleteReq(idSolicitud) {
    console.log("------------Esta es el id solicitud----------")
    console.log(idSolicitud)
    const confirmed = confirm("Are you sure you want to delete this request?");
    if (confirmed) {
        //Funcion propia de JS para mandar algun metodo
        fetch(`/nuclea/request/delete/${idSolicitud}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        })
        .then(res => {
           // return res.json();
        })
        
        .then(data => {
            
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred.");
        });
    } 
}