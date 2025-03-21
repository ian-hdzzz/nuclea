document.addEventListener("DOMContentLoaded", () => {
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("modal");

    openModal.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Cierra el modal si se hace clic fuera de él
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });

    const openModal2 = document.getElementById("openModal2");
    const closeModal2 = document.getElementById("closeModal2");
    const modal2 = document.getElementById("modal2");

    openModal2.addEventListener('click',()=>{
        modal2.classList.remove("hidden");
    })

    closeModal2.addEventListener('click',()=>{
        modal2.classList.add("hidden")
    })

    modal2.addEventListener("click",(e)=>{
        if(e.target==modal2){
            modal2.classList.add("hidden");
        }
    })



});
