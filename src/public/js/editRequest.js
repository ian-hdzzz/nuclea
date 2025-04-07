function editRequest(idSolicitud) {
    const row = document.querySelector(`[data-id='${idSolicitud}']`);
    const tipo = row.dataset.tipo;
    const inicio = row.dataset.inicio;
    const fin = row.dataset.fin;
    const descripcion = row.dataset.descripcion;
  
    const modal = document.getElementById("editModal");
    const form = document.getElementById("editForm");
  
    form.action = `/nuclea/request/${idSolicitud}/edit`;
    form.Tipo.value = tipo;
    form.Fecha_inicio.value = inicio;
    form.Fecha_fin.value = fin;
    form.Descripcion.value = descripcion;
  
    modal.classList.remove("hidden");
  }
  
  document.getElementById("closeEditModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
  });
  