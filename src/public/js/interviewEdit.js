// public/js/interview.js
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
    // Handle question form submission
    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = questionText.value.trim();
        if (!text) return;
        
        const description = questionDescription.value.trim();
        
        if (questionId.value) {
            // Edit existing question
            updateItem('questions', questionId.value, text, description);
        } else {
            // Add new question
            addItem('questions', text, description);
        }
        
        closeAllModals();
    });
    
    // Handle aspect save button
    saveAspectBtn.addEventListener('click', () => {
        const text = aspectText.value.trim();
        if (!text) return;
        
        if (aspectId.value) {
            // Edit existing aspect
            updateItem('aspects', aspectId.value, text);
        } else {
            // Add new aspect
            addItem('aspects', text);
        }
        
        closeAllModals();
    });
    
    // Handle aspect delete button
    deleteAspectBtn.addEventListener('click', () => {
        if (aspectId.value) {
            deleteItem('aspects', aspectId.value);
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
        
        document.getElementById('questionModalTitle').textContent = item ? 'Editar pregunta' : 'Agregar pregunta';
        
        // If editing, fill the form with existing data
        if (item) {
            questionId.value = item.id;
            questionText.value = item.text;
            questionDescription.value = item.description || '';
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
        
        document.getElementById('aspectModalTitle').textContent = item ? 'Editar aspecto' : 'Agregar aspecto';
        
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
    
    // Function to add a new item
    function addItem(context, text) {
        const listId = context === 'questions' ? 'questionList' : 'aspectList';
        const itemClass = context === 'questions' ? 'question-item' : 'aspect-item';
        const contentClass = context === 'questions' ? 'question-content' : 'aspect-content';
        const textClass = context === 'questions' ? 'question-text' : 'aspect-text';
        const actionsClass = context === 'questions' ? 'question-actions' : 'aspect-actions';
        const list = document.getElementById(listId);
        
        // Generate a unique ID
        const id = `${context.substring(0, 1)}-${Date.now()}`;
        
        // Create new item
        const li = document.createElement('li');
        li.className = itemClass;
        li.draggable = true;
        li.dataset.id = id;
        
        // En la función addItem o en tu plantilla Handlebars
        li.innerHTML = `
        <div class="${contentClass}">
            <span class="${textClass}">${text}</span>
            ${context === 'questions' ? 
              `<input type="hidden" class="question-description-data" value="${descripcionPregunta || ''}">` : ''}
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
        
        // Add to list
        list.appendChild(li);
        
        // Setup buttons for new item
        setupItemButtons(li);
        
        // Reinitialize drag and drop
        initDragAndDrop(listId);
    }
    

function updateItem(context, id, text, description) {
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
}
    
    // Function to delete an item
    function deleteItem(context, id) {
        const listId = context === 'questions' ? 'questionList' : 'aspectList';
        const item = document.querySelector(`#${listId} li[data-id="${id}"]`);
        
        if (item && confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
            item.remove();
        }
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
// Setup edit button
    function setupEditButton(btn) {
        btn.addEventListener('click', (e) => {
            const item = btn.closest('li');
            const itemId = item.dataset.id;
            const itemType = btn.dataset.type;
            const isQuestion = itemType === 'question';
            
            const textElement = item.querySelector(isQuestion ? '.question-text' : '.aspect-text');
            const itemText = textElement.textContent;
            
            // Obtener la descripción (si existe)
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
        
        setupEditButton(editBtn);
        setupDeleteButton(deleteBtn);
    }
});