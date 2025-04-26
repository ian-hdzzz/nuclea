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

document.addEventListener("DOMContentLoaded", () => {
    // Modal functionality
    const modal = document.getElementById("modal")
    const openModalBtn = document.getElementById("openModal")
    const closeModalBtn = document.getElementById("closeModal")
  
    if (openModalBtn) {
      openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden")
      })
    }
  
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden")
      })
    }
  
    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden")
      }
    })
  
    // Dropdown functionality for action buttons
    const actionButtons = document.querySelectorAll(".action-btn")
  
    actionButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
  
        // Close all other dropdowns first
        document.querySelectorAll(".dropdown-content").forEach((content) => {
          if (content !== this.parentElement.querySelector(".dropdown-content")) {
            content.classList.remove("show")
          }
        })
  
        // Toggle the current dropdown
        const dropdownContent = this.parentElement.querySelector(".dropdown-content")
        if (dropdownContent) {
          dropdownContent.classList.toggle("show")
        }
      })
    })
  
    // Close dropdowns when clicking elsewhere on the page
    window.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-content").forEach((content) => {
        content.classList.remove("show")
      })
    })
  })
  
  document.addEventListener("DOMContentLoaded", () => {
    const modal2 = document.getElementById("modal2");
    const closeModal2 = document.getElementById("closeModal2");
    const editButtons = document.querySelectorAll(".edit-btn");

    // Abrir el modal de edición al hacer clic en "Edit"
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            modal2.classList.remove("hidden");
        });
    });

    // Cerrar el modal cuando se haga clic en la "X"
    closeModal2.addEventListener("click", () => {
        modal2.classList.add("hidden");
    });

    // Cerrar el modal si se hace clic fuera de él
    modal2.addEventListener("click", (e) => {
        if (e.target === modal2) {
            modal2.classList.add("hidden");
        }
    });
});

 // Tutorial steps configuration
 const tutorialSteps = [
    {
        element: "welcome",
        title: "Welcome to the Requests Tutorial",
        content: "This guided tour will help you easily create, view, and manage your absence requests."
    },
    {
        element: "pending-content",
        title: "Pending Vacation Requests",
        content: "Here you can review all your absence requests that are still pending approval and view upcoming holidays to plan ahead."
    },
    {
        element: "btn-actions",
        title: "Actions Section",
        content: "This section contains action buttons where you can approve or reject vacation requests directly from the table."
    },
    {
        element: "btn-personal",
        title: "Return to Personal Requests",
        content: "Use this button to navigate back to your personal list of absence requests, where you can view and manage your submissions."
    },
    {
        element: "btn-accepted",
        title: "Go to Accepted Absences",
        content: "Click here to see all the vacation requests that have already been approved by the management."
    },
    {
        element: "accepted",
        title: "Accepted Vacation Requests",
        content: "This table shows only the absences that have been successfully approved, providing an organized view of your confirmed leaves."
    }
];

let currentStep = 0;
let isTutorialActive = false;

// Hide loader when page is loaded
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loaderWrapper').style.display = 'none';
    // Auto-start tutorial after loader is hidden
    setTimeout(startTutorial, 1000);
  }, 1500);
});

// Initialize tutorial toggle button
document.getElementById('tutorial-toggle').addEventListener('click', function() {
  startTutorial();
});

// Function to start the tutorial
function startTutorial() {
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  tutorialOverlay.style.display = 'flex';
  isTutorialActive = true;
  currentStep = 0;
  showTutorialStep(currentStep);
}

// Function to show a specific tutorial step
function showTutorialStep(stepIndex) {
  if (stepIndex >= tutorialSteps.length) {
    endTutorial();
    return;
  }

  const step = tutorialSteps[stepIndex];
  const tooltip = document.getElementById('tutorial-tooltip');
  const highlight = document.getElementById('highlight');
  
  // Show modal if needed for this step
  if (step.showModal) {
    document.getElementById('modal').classList.remove('hidden');
  } else if (stepIndex > 0 && tutorialSteps[stepIndex - 1].showModal) {
    document.getElementById('modal').classList.add('hidden');
  }
  
  // Update tooltip content
  tooltip.innerHTML = `
    <h3>${step.title}</h3>
    <p>${step.content}</p>
    <div class="tooltip-buttons">
      ${stepIndex > 0 ? '<button class="tooltip-button secondary" id="prev-button">Previous</button>' : ''}
      <button class="tooltip-button" id="next-button">
        ${stepIndex === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
    <div class="progress-dots">
      ${tutorialSteps.map((_, i) => 
        `<div class="progress-dot ${i === stepIndex ? 'active' : ''}"></div>`
      ).join('')}
    </div>
  `;
  
  // Position highlight and tooltip
  if (step.element === "welcome" || step.element === "complete") {
    // Center in the screen for intro and completion
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    highlight.style.display = 'none';
  } else {
    // Highlight specific element
    const element = document.getElementById(step.element);
    if (element) {
      const rect = element.getBoundingClientRect();
      
      // Position highlight
      highlight.style.display = 'block';
      highlight.style.top = `${rect.top - 10}px`;
      highlight.style.left = `${rect.left - 10}px`;
      highlight.style.width = `${rect.width + 20}px`;
      highlight.style.height = `${rect.height + 20}px`;
      
      // Position tooltip
      let tooltipLeft = rect.left + rect.width + 30;
      let tooltipTop = rect.top;
      
      // Check if tooltip would go off-screen to the right
      if (tooltipLeft + 320 > window.innerWidth) {
        tooltipLeft = rect.left - 320;
        if (tooltipLeft < 10) tooltipLeft = 70; // Prevent going off-screen to the left
      }
      
      // Check if tooltip would go off-screen at the bottom
      if (tooltipTop + 200 > window.innerHeight) {
        tooltipTop = window.innerHeight - 220;
        if (tooltipTop < 10) tooltipTop = 10; // Prevent going off-screen at the top
      }
      
      tooltip.style.top = `${tooltipTop}px`;
      tooltip.style.left = `${tooltipLeft}px`;
      tooltip.style.transform = 'none';
    }
  }
  
  // Add event listeners to buttons
  if (document.getElementById('next-button')) {
    document.getElementById('next-button').addEventListener('click', function() {
      showTutorialStep(stepIndex + 1);
    });
  }
  
  if (document.getElementById('prev-button')) {
    document.getElementById('prev-button').addEventListener('click', function() {
      showTutorialStep(stepIndex - 1);
    });
  }
}

// Function to end the tutorial
function endTutorial() {
  // Make sure modal is hidden when tutorial ends
  document.getElementById('modal').classList.add('hidden');
  
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  tutorialOverlay.innerHTML = `
    <div class="completion-message">
      <h2>¡Tutorial Completed! 🎉</h2>
      <p>You are now ready to manage and process pending absence requests efficiently</p>
      <button class="tooltip-button" id="finish-button">Close</button>
    </div>
  `;
  
  document.getElementById('finish-button').addEventListener('click', function() {
    tutorialOverlay.style.display = 'none';
    isTutorialActive = false;
  });
}

// Handle window resize to reposition tooltip and highlight
window.addEventListener('resize', function() {
  if (isTutorialActive) {
    showTutorialStep(currentStep);
  }
});

// Original AO.js functionality (simplified version)
document.addEventListener('DOMContentLoaded', function() {
  // Open modal
  const openModalBtn = document.getElementById('openModal');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');
  
  if (openModalBtn) {
    openModalBtn.addEventListener('click', function() {
      modal.classList.remove('hidden');
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      modal.classList.add('hidden');
    });
  }
  
  // Dropdown functionality
  const actionBtns = document.querySelectorAll('.action-btn');
  
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const dropdownContent = this.nextElementSibling;
      dropdownContent.classList.toggle('show');
    });
  });
  
  // Close dropdowns when clicking outside
  window.addEventListener('click', function(event) {
    if (!event.target.matches('.action-btn')) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      });
    }
  });

  
    // Dropdown functionality for action buttons
    const actionButtons = document.querySelectorAll(".action-btn")
  
    actionButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation()
  
        // Close all other dropdowns first
        document.querySelectorAll(".dropdown-content").forEach((content) => {
          if (content !== this.parentElement.querySelector(".dropdown-content")) {
            content.classList.remove("show")
          }
        })
  
        // Toggle the current dropdown
        const dropdownContent = this.parentElement.querySelector(".dropdown-content")
        if (dropdownContent) {
          dropdownContent.classList.toggle("show")
        }
      })
    })
  
    // Close dropdowns when clicking elsewhere on the page
    window.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-content").forEach((content) => {
        content.classList.remove("show")
      })
    })
});


