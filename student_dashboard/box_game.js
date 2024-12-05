document.addEventListener("DOMContentLoaded", () => {
    const codeBlocks = document.querySelectorAll(".flex-box");
    const dropTargets = document.querySelectorAll(".empty-box");
    let draggedElement = null;

    codeBlocks.forEach(block => {
      block.addEventListener("dragstart", event => {
        draggedElement = event.target;
        event.dataTransfer.effectAllowed = "move";
      });
    });
  
    dropTargets.forEach(target => {
      target.addEventListener("dragover", event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      });
  
      target.addEventListener("drop", event => {
        event.preventDefault();
  
        if (target.firstElementChild) {
          const existingElement = target.firstElementChild;
          const flexContainer = document.querySelector(".flex-container");
          flexContainer.appendChild(existingElement);
        }
  
        let width = draggedElement.offsetWidth;
        target.appendChild(draggedElement);
        target.style.width = `${width + 10}px`; // 10 is margin
        draggedElement = null;
      });
    });
  
    document.body.addEventListener("dragend", () => {
      if (draggedElement && !draggedElement.parentNode.closest(".empty-box")) {
        const flexContainer = document.querySelector(".flex-container");
        flexContainer.appendChild(draggedElement);
        draggedElement = null;
      }
    });
  });
  