// public/js/drag-drop.js
document.addEventListener('DOMContentLoaded', function() {
    initDragAndDrop('questionList');
    initDragAndDrop('aspectList');
});

function initDragAndDrop(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    let draggedItem = null;
    let placeholder = document.createElement('li');
    placeholder.className = 'item-placeholder';
    
    // Add event listeners to all items in the list
    function addDragListeners() {
        const items = list.querySelectorAll('li');
        
        items.forEach(item => {
            // Remove existing listeners first to avoid duplicates
            item.removeEventListener('dragstart', handleDragStart);
            item.removeEventListener('dragend', handleDragEnd);
            item.removeEventListener('dragover', handleDragOver);
            item.removeEventListener('dragenter', handleDragEnter);
            item.removeEventListener('dragleave', handleDragLeave);
            item.removeEventListener('drop', handleDrop);
            
            // Add listeners
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
        });
    }
    
    // Initialize listeners
    addDragListeners();
    
    // Dragstart handler
    function handleDragStart(e) {
        draggedItem = this;
        
        // Set the drag data (needed for Firefox)
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        
        // Add dragging class for styling
        setTimeout(() => {
            this.classList.add('dragging');
        }, 0);
    }
    
    // Dragend handler
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        
        // Remove placeholder if it exists
        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
        
        // Remove all dragover classes
        list.querySelectorAll('.dragover').forEach(item => {
            item.classList.remove('dragover');
        });
        
        // Save the new order
        saveItemOrder(list);
    }
    
    // Dragover handler
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    // Dragenter handler
    function handleDragEnter(e) {
        this.classList.add('dragover');
    }
    
    // Dragleave handler
    function handleDragLeave(e) {
        this.classList.remove('dragover');
    }
    
    // Drop handler
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // If we're not dropping onto the original dragged item
        if (draggedItem !== this) {
            // Insert the dragged item before the drop target
            list.insertBefore(draggedItem, this);
            
            // Re-add event listeners to all items
            addDragListeners();
        }
        
        this.classList.remove('dragover');
        return false;
    }
    
    // Save the new order
    function saveItemOrder(list) {
        const items = list.querySelectorAll('li');
        const newOrder = Array.from(items).map(item => item.dataset.id);
        
        // Here you could send the new order to your server
        console.log('New order saved:', newOrder);
        
        // Example: Send to server
        // fetch('/api/update-order', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         listId: list.id,
        //         newOrder: newOrder
        //     }),
        // });
    }
}