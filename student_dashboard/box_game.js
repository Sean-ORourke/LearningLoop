document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll(".flex-box");
  const dropTargets = document.querySelectorAll(".empty-box");
  const flexContainer = document.querySelector(".flex-container");
  const blockList = []
  localStorage.clear()
  let draggedElement = null;
  let score = 0;

  // set up correct answers for draggables and target boxes
  const correctAnswers = {
    0: 0, 
    1: 1, 
    2: 2, 
    3: 3, 
    4: 4,
    5: 5, 
    6: 6 
  };

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
        if(existingElement.title != draggedElement.title){
          if(localStorage[Number(existingElement.title)] == correctAnswers[existingElement.title]) score--; //If the block being kicked out was correct, reduce score
        }
        
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
        // access draggable element and target box
        const blockIndex = Number(draggedElement.title);
        const targetIndex = Number(target.title);
        // compare element and target : if match --> score++
        // if the numbers don't match, do nothing 
        if (correctAnswers[targetIndex] === blockIndex) score++;
        
        if(localStorage[Number(draggedElement.title)] == correctAnswers[draggedElement.title]) score--; //If the moved code block is being moved out of the correct position, reduce score
        //if(target.hasChildNodes)
        
        localStorage.setItem("score", score);

        blockList[Number(draggedElement.title)] = Number(target.title);
        document.getElementById("order").innerHTML += draggedElement.title + target.title; //+ "[" + blockList.toString() + "] ";
        localStorage[Number(draggedElement.title)] = Number(target.title);

        draggedElement = null;
      }
    });
  });

  document.body.addEventListener("dragend", () => {
    if (draggedElement && !draggedElement.parentNode.closest(".empty-box") && draggedElement.parentNode !== flexContainer) {
      flexContainer.appendChild(draggedElement);
      if(localStorage[Number(draggedElement.title)] == correctAnswers[draggedElement.title]) score--; //If the moved code block is being moved out of the correct position, reduce score
      draggedElement = null;
    }
  });
});
