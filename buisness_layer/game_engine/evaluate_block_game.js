

document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll(".flex-box");
  const dropTargets = document.querySelectorAll(".empty-box");
  const flexContainer = document.querySelector(".flex-container");
  const blockList = []
  localStorage.clear()
  let draggedElement = null;
  let score = 0; // to hold the total score that will be written to localStorage
  let round_block_points = 100; // will decrement for each round (100, 75, 50)
  let rounds_left = 4; // to calculate bonus points for not using all rounds
  let check_answers = true; // will be false if user gets all correct

  // set up correct answers for draggables and target boxes
  const correctAnswers = {
    "box_0": "code_0",
    "box_1": "code_1",
    "box_2": "code_2",
    "box_3": "code_3",
    "box_4": "code_4",
    "box_5": "code_5",
    "box_6": "code_6",
  };

  check_button = document.getElementById("check_button");
  check_button.addEventListener("click", event => {
    console.log("Button clicked");
    let incorrect_answers = 0;
    let empty_block = false; // if we see an empty block we want to end the score calculation

    // iterate once at beginning to check for empty box before anything else
    dropTargets.forEach(box => {
      let codeBlock = box.childNodes[0]; // this will return the code block if it is present

      if (codeBlock === undefined) {
        empty_block = true;
        box.setAttribute("class", "unanswered-box");
      }
    });

    console.log("Empty block is true");

    // iterate through each dropTarget and test if the answer is correct
    if (!empty_block) { // only going to do this if the user has no empty blocks
      dropTargets.forEach(box => {
        let codeBlock = box.childNodes[0]; // this will return the code block if it is present

        // if code block undefined, then user did not put a code block in the slot
        if (codeBlock === undefined) {
          console.log("No block here ");
          empty_block = true;
          box.setAttribute("class", "unanswered-box");
          return; // this will go to next iteration
        }

        // don't calculate anything if we have seen an empty box

        // otherwise, lets check if the answer in the box is correct
        let correct_answer = correctAnswers[box.id];
        console.log(box.id)
        console.log(codeBlock)

        if (correct_answer === codeBlock.id) {
          // make box green (or whatever is set in correct-box css rules)
          let class_name = box.getAttribute("class");
          if (class_name !== "correct-box") {
            box.setAttribute("class", "correct-box")
            score += round_block_points;
          }
        } else {
          // make box red (or whatever is set in incorrect-box css rules)
          box.setAttribute("class", "incorrect-box")
          incorrect_answers++;
        }
      });

      // add correct points to score element
      let score_element = document.getElementById("running_points");
      score_element.innerText = `Points: ${score}`;

      // reduce score adder for next check
      if (round_block_points > 50) // this will limit the points to 3 rounds
        round_block_points -= 25;
      else {
        round_block_points = 0;
      }

      localStorage.setItem("score", score);
      if (rounds_left !== 0)
        rounds_left--;
      localStorage.setItem("rounds_left", rounds_left)
    }
  });

  let next_page = document.getElementById("summary_page");
  next_page.addEventListener("click", event => {

    // those with extra rounds will get more points
    let button = document.getElementById("check_button");
    button.click();
  });

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
        if (localStorage[Number(existingElement.title)] == correctAnswers[existingElement.title]) score--; //If the block being kicked out was correct, reduce score
        document.getElementById("debug").innerHTML += "kick";

      }

      if (draggedElement) {
        if (draggedElement.parentNode.classList.contains("correct-box"))
          return;
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
        blockList[Number(target.title)] = Number(draggedElement.title);
        document.getElementById("order").innerHTML += draggedElement.title + target.title;
        localStorage[Number(draggedElement.title)] = Number(target.title);

        draggedElement = null;
      }
    });
  });

  document.body.addEventListener("dragend", () => {
    if (draggedElement && !draggedElement.parentNode.closest(".empty-box") && draggedElement.parentNode !== flexContainer) {
      if (draggedElement.parentNode.classList.contains("correct-box"))
        return;
      flexContainer.appendChild(draggedElement);
      if (localStorage[Number(draggedElement.title)] == correctAnswers[draggedElement.title]) {
        score--;
        localStorage[Number(draggedElement.title)] = -1;
        document.getElementById("debug").innerHTML += "ugh ";
        localStorage.setItem("score", score);
      }

      draggedElement = null;
    }
    let previousContainer = null;
    if (previousContainer !== null && previousContainer !== flexContainer) {
      previousContainer.classList.remove('filled-box');
      previousContainer.classList.add('empty-box');
    }
    previousContainer = null;
  });


});
