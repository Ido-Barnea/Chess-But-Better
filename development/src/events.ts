let draggedElement: HTMLElement;

let triggerOnAction: (
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
) => void;
let triggerOnFallOffTheBoard: (draggedElement: HTMLElement) => void;

const normalBtn = document.getElementById("normalbtn");
normalBtn!.addEventListener("click", handleButtonPress);
const hellBtn = document.getElementById("hellbtn");
hellBtn!.addEventListener("click", handleButtonPress);
const heavenBtn = document.getElementById("heavenbtn");
heavenBtn!.addEventListener("click", handleButtonPress);

let triggerOnHighlight: (target: HTMLElement, shouldHighlight: boolean) => void;

export function initializeEventListeners() {
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.addEventListener("dragstart", onDragStart);
    square.addEventListener("dragover", onDragOver);
    square.addEventListener("drop", onDragDrop);
    square.addEventListener("mouseover", onMouseOver);
    square.addEventListener("mouseout", onMouseOut);
  });

  // Support pieces falling off the board
  document.body.addEventListener("dragover", onDragOver);
  document.body.addEventListener("drop", onDragOffTheBoard);
}

function onDragStart(event: Event) {
  const targetElement = event.target as HTMLElement;
  if (targetElement.classList.contains("piece")) {
    draggedElement = event.target as HTMLElement;
  }
}

function onDragDrop(event: Event) {
  event.stopPropagation();
  let targetElement = event.target as HTMLElement;
  // Make sure target is not a resource
  while (targetElement.classList.contains("untargetable")) {
    targetElement = targetElement.parentNode as HTMLElement;
  }

  triggerOnAction(draggedElement, targetElement);
}

function onDragOver(event: Event) {
  event.preventDefault();
}

function onDragOffTheBoard(_: Event) {
  triggerOnFallOffTheBoard(draggedElement);
}

function handleMouseEvents(event: Event, shouldHighlight: boolean) {
  let target = event.target as HTMLElement;
  triggerOnHighlight(target, shouldHighlight);
}

function onMouseOver(event: Event) {
  handleMouseEvents(event, true);
}

function onMouseOut(event: Event) {
  handleMouseEvents(event, false);
}

export function setOnAction(
  _triggerOnAction: (
    draggedElement: HTMLElement,
    targetElement: HTMLElement,
  ) => void,
) {
  triggerOnAction = _triggerOnAction;
}

export function setOnFallOffTheBoard(
  _triggerOnFallOffTheBoard: (draggedElement: HTMLElement) => void,
) {
  triggerOnFallOffTheBoard = _triggerOnFallOffTheBoard;
}

export function setOnHighlight(
  _triggerOnHighlight: (target: HTMLElement, shouldHighlight: boolean) => void,
) {
  triggerOnHighlight = _triggerOnHighlight;
}

function scrollToBoard(id: string) {
  const targetElement = document!.getElementById(id);
  const boardsContainer = document!.getElementById("boards-container");
  switch (id) {
    case "board-container":
      console.log("top element");
      boardsContainer!.scrollTop = 0;
    default:
      const elementPosition = targetElement!.offsetTop;
      boardsContainer!.scrollTop = elementPosition;
  }
}

export function handleButtonPress(event: Event) {
  const buttonValue = (event.target as HTMLButtonElement).value;
  scrollToBoard(buttonValue);
}
