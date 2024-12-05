document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll(".flex-box");
  const dropTargets = document.querySelectorAll(".empty-box");
  const flexContainer = document.querySelector(".flex-container");
  let draggedElement = null;

  codeBlocks.forEach(block => {
    block.addEventListener("dragstart", event => {
      draggedElement = event.target;
      event.dataTransfer.effectAllowed = "move";
      console.log(`Drag started: ${draggedElement.textContent}`);
    });
  });

  [...dropTargets, flexContainer].forEach(target => {
    target.addEventListener("dragover", event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });

    target.addEventListener("drop", event => {
      event.preventDefault();

      if (target !== flexContainer && target.children.length > 0) {
        const existingElement = target.firstElementChild;
        flexContainer.appendChild(existingElement);
      }

      if (draggedElement) {
        if (target === flexContainer) {
          if (draggedElement.parentNode.classList.contains("filled-box")) {
            draggedElement.parentNode.classList.remove("filled-box");
            draggedElement.parentNode.classList.add("empty-box");
          }
        } else {
          target.classList.remove("empty-box");
          target.classList.add("filled-box");
        }

        target.appendChild(draggedElement);

        draggedElement = null;
      }
    });
  });

  document.body.addEventListener("dragend", () => {
    if (draggedElement && !draggedElement.parentNode.closest(".empty-box") && draggedElement.parentNode !== flexContainer) {
      flexContainer.appendChild(draggedElement);
      draggedElement = null;
    }
  });
});
