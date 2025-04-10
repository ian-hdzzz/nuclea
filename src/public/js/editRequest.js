function editRequest(idSolicitud) {
    const row = document.querySelector(`[data-id='${idSolicitud}']`);
    const tipo = row.dataset.tipo;
    const inicio = row.dataset.inicio;
    const fin = row.dataset.fin;
    const descripcion = row.dataset.descripcion;

    function formatDate2(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    const modal = document.getElementById("editModal");
    const form = document.getElementById("editForm");
  
    form.action = `/nuclea/request/${idSolicitud}/edit`;
    form.tipo.value = tipo;
    form.fechaInicio.value = formatDate2(inicio);
    form.fechaFin.value = formatDate2(fin);
    form.descripcion.value = descripcion;
  
    modal.classList.remove("hidden");
  }
  
  document.getElementById("closeEditModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
  });
  