// Get the CSRF token from the page
function getCsrfToken() {
    // Try to get it from a meta tag if you've added one
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }
    
    // If no meta tag, try to get it from a hidden input if you've added one
    const csrfInput = document.querySelector('input[name="_csrf"]');
    if (csrfInput) {
        return csrfInput.value;
    }
    
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const questionModal = document.getElementById('questionModal');
    const aspectModal = document.getElementById('aspectModal');
    const addQuestionBtn = document.getElementById('addQuestion');
    const addAspectBtn = document.getElementById('addAspect');
    const closeButtons = document.querySelectorAll('.close-modal');
    const questionForm = document.getElementById('questionForm');
    const aspectForm = document.getElementById('aspectForm');
    
    // Form elements
    const questionId = document.getElementById('questionId');
    const questionText = document.getElementById('questionText');
    const questionDescription = document.getElementById('questionDescription');
    const aspectId = document.getElementById('aspectId');
    const aspectText = document.getElementById('aspectText');
    
    // Modal action buttons
    const saveAspectBtn = aspectModal.querySelector('.btn-save');
    const deleteAspectBtn = aspectModal.querySelector('.btn-delete-modal');
    const cancelAspectBtn = aspectModal.querySelector('.btn-cancel');

    // Open modal for adding a question
    addQuestionBtn.addEventListener('click', () => {
        openQuestionModal(null);
    });
    
    // Open modal for adding an aspect
    addAspectBtn.addEventListener('click', () => {
        openAspectModal(null);
    });
    
    // Close all modals
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === questionModal || e.target === aspectModal) {
            closeAllModals();
        }
    });
    
    // Handle question form submission
    questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = questionText.value.trim();
        if (!text) return;
        
        const description = questionDescription ? questionDescription.value.trim() : '';
        
        if (questionId.value) {
            // Edit existing question
            await updateItem('questions', questionId.value, text, description);
        } else {
            // Add new question
            await addItem('questions', text, description);
        }
        
        closeAllModals();
    });
    
    // Handle aspect save button
    saveAspectBtn.addEventListener('click', async () => {
        const text = aspectText.value.trim();
        if (!text) return;
        
        if (aspectId.value) {
            // Edit existing aspect
            await updateItem('aspects', aspectId.value, text);
        } else {
            // Add new aspect
            await addItem('aspects', text);
        }
        
        closeAllModals();
    });
    
    // Handle aspect delete button
    deleteAspectBtn.addEventListener('click', async () => {
        if (aspectId.value) {
            await deleteItem('aspects', aspectId.value);
        }
        closeAllModals();
    });
    
    // Handle aspect cancel button
    cancelAspectBtn.addEventListener('click', closeAllModals);
    
    // Setup edit and delete buttons for all items
    setupListItemButtons();
    
    // Function to open question modal
    function openQuestionModal(item) {
        // Reset form
        questionForm.reset();
        questionId.value = '';
        
        document.getElementById('questionModalTitle').textContent = item ? 'Edit question' : 'Add question';
        
        // If editing, fill the form with existing data
        if (item) {
            questionId.value = item.id;
            questionText.value = item.text;
            if (questionDescription && item.description !== undefined) {
                questionDescription.value = item.description;
            }
        }
        
        // Show modal
        questionModal.classList.add('active');
        questionText.focus();
    }
    
    // Function to open aspect modal
    function openAspectModal(item) {
        // Reset form
        aspectForm.reset();
        aspectId.value = '';
        
        document.getElementById('aspectModalTitle').textContent = item ? 'Edit aspect' : 'Add aspect';
        
        // If editing, fill the form with existing data
        if (item) {
            aspectId.value = item.id;
            aspectText.value = item.text;
        }
        
        // Show modal
        aspectModal.classList.add('active');
        aspectText.focus();
    }
    
    // Function to close all modals
    function closeAllModals() {
        questionModal.classList.remove('active');
        aspectModal.classList.remove('active');
    }

    // Setup edit and delete buttons for all items
    function setupListItemButtons() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            setupEditButton(btn);
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            setupDeleteButton(btn);
        });
    }
    
    // Setup edit button
    function setupEditButton(btn) {
        btn.addEventListener('click', (e) => {
            const item = btn.closest('li');
            const itemId = item.dataset.id;
            const itemType = btn.dataset.type;
            const isQuestion = itemType === 'question';
            
            const textElement = item.querySelector(isQuestion ? '.question-text' : '.aspect-text');
            const itemText = textElement.textContent;

            // Obtener la descripción
            let itemDescription = '';
            if (isQuestion) {
                const descriptionElement = item.querySelector('.question-description-data');
                itemDescription = descriptionElement ? descriptionElement.value : '';
            }

            if (isQuestion) {
                openQuestionModal({ id: itemId, text: itemText, description: itemDescription });
            } else {
                openAspectModal({ id: itemId, text: itemText });
            }
        });
    }
    
    // Setup delete button
    function setupDeleteButton(btn) {
        btn.addEventListener('click', (e) => {
            const item = btn.closest('li');
            const itemId = item.dataset.id;
            const isQuestion = item.classList.contains('question-item');
            
            deleteItem(isQuestion ? 'questions' : 'aspects', itemId);
        });
    }
    
    // Setup item buttons for a specific item
    function setupItemButtons(item) {
        const editBtn = item.querySelector('.btn-edit');
        const deleteBtn = item.querySelector('.btn-delete');
        
        if (editBtn) setupEditButton(editBtn);
        if (deleteBtn) setupDeleteButton(deleteBtn);
    }

    // Inicializar drag and drop si existe la función
    if (typeof initDragAndDrop === 'function') {
        initDragAndDrop('questionList');
        initDragAndDrop('aspectList');
    }
});

// Function to add a new item
// Function to add a new item with better error handling
async function addItem(context, text, description = '') {
    const type = context === 'questions' ? 'abierta' : 'cerrada';
    const csrfToken = getCsrfToken();
    
    try {
        // Muestra un indicador de carga si lo deseas
        // showLoadingIndicator();
        
        const response = await fetch('/nuclea/interview/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                pregunta: text,
                descripcionPregunta: description,
                tipoPregunta: type,
                orden: 0 // Default order
            })
        });
        
        // Verificar respuesta
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            alert(`Error ${response.status}: ${errorText || 'Error en la petición'}`);
            return false;
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data && data.success) {
            // Añadir elemento a la UI
            const listId = context === 'questions' ? 'questionList' : 'aspectList';
            const itemClass = context === 'questions' ? 'question-item' : 'aspect-item';
            const contentClass = context === 'questions' ? 'question-content' : 'aspect-content';
            const textClass = context === 'questions' ? 'question-text' : 'aspect-text';
            const actionsClass = context === 'questions' ? 'question-actions' : 'aspect-actions';
            const list = document.getElementById(listId);
            
            const li = document.createElement('li');
            li.className = itemClass;
            li.draggable = true;
            li.dataset.id = data.questionId;
            
            li.innerHTML = `
            <i class="fa-solid fa-ellipsis-vertical"></i>
                <div class="${contentClass}">
                    <span class="${textClass}">${text}</span>
                     <p>${description}</p>
                    <input type="hidden" class="question-description-data" value="${description}">
                    ${context === 'questions' ? 
                        `<input type="hidden" class="question-description-data" value="${description || ''}">` : ''}
                </div>
                <div class="${actionsClass}">
                    <button class="btn-edit" title="Editar" data-type="${context === 'questions' ? 'question' : 'aspect'}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(li);
            
            // Configurar botones para el nuevo elemento
            const editBtn = li.querySelector('.btn-edit');
            const deleteBtn = li.querySelector('.btn-delete');
            
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    const itemId = li.dataset.id;
                    const itemType = editBtn.dataset.type;
                    const textElement = li.querySelector(`.${textClass}`);
                    const itemText = textElement.textContent;
                    
                    let itemDescription = '';
                    if (context === 'questions') {
                        const descriptionElement = li.querySelector('.question-description-data');
                        itemDescription = descriptionElement ? descriptionElement.value : '';
                    }
                    
                    if (itemType === 'question') {
                        openQuestionModal({ id: itemId, text: itemText, description: itemDescription });
                    } else {
                        openAspectModal({ id: itemId, text: itemText });
                    }
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    const itemId = li.dataset.id;
                    deleteItem(context, itemId);
                });
            }
            
            // Reiniciar drag and drop si está disponible
            if (typeof initDragAndDrop === 'function') {
                initDragAndDrop(listId);
            }
            
            // Mostrar mensaje de éxito
            showSuccessMessage(context === 'questions' ? 'Question' : 'Aspect');
            
            return true;
        } else {
            alert('Error al agregar: ' + (data ? data.message || 'Error desconocido' : 'Respuesta no válida'));
            return false;
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Error al agregar el elemento. Por favor intente de nuevo.');
        return false;
    } finally {
        // Oculta el indicador de carga si lo usas
        // hideLoadingIndicator();
    }
}

// Función auxiliar para mostrar mensaje de éxito
function showSuccessMessage(itemType) {
    // Crea un elemento de alerta de éxito
    const successAlert = document.createElement('div');
    successAlert.className = 'success-alert';
    successAlert.textContent = `¡${itemType} added successfully!`;
    
    // Estilos para la alerta
    successAlert.style.position = 'fixed';
    successAlert.style.top = '20px';
    successAlert.style.right = '20px';
    successAlert.style.backgroundColor = '#4CAF50';
    successAlert.style.color = 'white';
    successAlert.style.padding = '15px 20px';
    successAlert.style.borderRadius = '4px';
    successAlert.style.zIndex = '1000';
    successAlert.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    // Añade la alerta al body
    document.body.appendChild(successAlert);
    
    // Elimina la alerta después de 3 segundos
    setTimeout(() => {
        successAlert.style.opacity = '0';
        successAlert.style.transition = 'opacity 0.5s ease';
        
        // Elimina el elemento del DOM después de la transición
        setTimeout(() => {
            document.body.removeChild(successAlert);
        }, 500);
    }, 1500);
}

// Function to update an item
async function updateItem(context, id, text, description = '') {
    const csrfToken = getCsrfToken();
    
    try {
        const response = await fetch(`/nuclea/interview/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({
                pregunta: text,
                descripcionPregunta: description
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update UI
            const listId = context === 'questions' ? 'questionList' : 'aspectList';
            const textClass = context === 'questions' ? 'question-text' : 'aspect-text';
            const item = document.querySelector(`#${listId} li[data-id="${id}"]`);
            
            if (item) {
                const textElement = item.querySelector(`.${textClass}`);
                textElement.textContent = text;
                
                // Update description if it's a question
                if (context === 'questions' && description !== undefined) {
                    const descriptionElement = item.querySelector('.question-description-data');
                    if (descriptionElement) {
                        descriptionElement.value = description;
                    }
                }
            }
        } else {
            alert('Error al actualizar la pregunta: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating item:', error);
        alert('Error al actualizar la pregunta. Por favor intente de nuevo.');
    }
}

// Function to delete an item
async function deleteItem(context, id) {
    try {
        if (!confirm('¿Are you sure you want to delete this item?')) {
            return;
        }
        
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            console.error('CSRF token not found');
            alert('Error: Security token not found. Please refresh the page and try again.');
            return;
        }
        
        console.log('Deleting item:', { context, id }); // Debug log
        
        const response = await fetch(`/nuclea/interview/edit/${id}`, {
            method: 'DELETE',
            headers: {
                'CSRF-Token': csrfToken,
                'X-CSRF-Token': csrfToken
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', response.status, errorText);
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Remove UI element
            const listId = context === 'questions' ? 'questionList' : 'aspectList';
            const item = document.querySelector(`#${listId} li[data-id="${id}"]`);
            
            if (item) {
                item.remove();
                console.log('Item removed from UI successfully');
            } else {
                console.warn('Item not found in UI after deletion');
            }
        } else {
            console.error('Delete operation failed:', data.message);
            alert('Error al eliminar la pregunta: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error al eliminar la pregunta: ' + (error.message || 'Por favor intente de nuevo.'));
    }
}


