function approveRequest(idSolicitud) {
    const confirmed = confirm("Do you want to approve this request?");
    if (confirmed) {
      // Crear y enviar un formulario dinámicamente
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/nuclea/request/${idSolicitud}/approve`;
  
      const csrfToken = document.querySelector('input[name="_csrf"]');
      if (csrfToken) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "_csrf";
        hiddenInput.value = csrfToken.value;
        form.appendChild(hiddenInput);
      }
  
      document.body.appendChild(form);
      form.submit();
    }
  }
  
  function rejectRequest(idSolicitud) {
    const confirmed = confirm("Do you want to reject this request?");
    if (confirmed) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/nuclea/request/${idSolicitud}/reject`;
  
      const csrfToken = document.querySelector('input[name="_csrf"]');
      if (csrfToken) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "_csrf";
        hiddenInput.value = csrfToken.value;
        form.appendChild(hiddenInput);
      }
  
      document.body.appendChild(form);
      form.submit();
    }
  }
  