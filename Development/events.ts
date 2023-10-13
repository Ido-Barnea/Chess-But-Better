let draggedElement: HTMLElement;

let triggerOnAction: (draggedElement: HTMLElement, targetElement: HTMLElement) => void;
let triggerOnFallOffTheBoard: (draggedElement: HTMLElement) => void;

export function initializeEventListeners() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((square) => {
        square.addEventListener('dragstart', onDragStart);
        square.addEventListener('dragover', onDragOver);
        square.addEventListener('drop', onDragDrop);
        square.addEventListener('mouseover', onMouseOver);
        square.addEventListener('mouseout', onMouseOut);
    });

    // Support pieces falling off the board
    document.body.addEventListener('dragover', onDragOver);
    document.body.addEventListener('drop', onDragOffTheBoard);
}

function onDragStart(event) {
    if (event.target.classList.contains('piece')) {
        draggedElement = event.target;
    }
}

function onDragDrop(event) {
    event.stopPropagation();
    let targetElement = event.target;
    // Make sure target is not a resource
    while (targetElement.classList.contains('untargetable')) {
        targetElement = targetElement.parentNode;
    }

    triggerOnAction(draggedElement, targetElement);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDragOffTheBoard(_) {
    triggerOnFallOffTheBoard(draggedElement);
}

function handleMouseEvents(event, shouldAddClass) {
    let target = event.target;
    if (target.parentNode.classList.contains('square')) {
        target = target.parentNode;
    }
    if (target.classList.contains('square')) {
        if (shouldAddClass) {
            target.classList.add('light-gray-background');
        } else {
            target.classList.remove('light-gray-background');
        }
    }
}

function onMouseOver(event) {
    handleMouseEvents(event, true);
}

function onMouseOut(event) {
    handleMouseEvents(event, false);
}

export function setOnAction(triggerOnAction: (draggedElement: HTMLElement, targetElement: HTMLElement) => void) {
    this.triggerOnAction = triggerOnAction;
}

export function setOnFallOffTheBoard(triggerOnFallOffTheBoard: (draggedElement: HTMLElement) => void) {
    this.triggerOnFallOffTheBoard = triggerOnFallOffTheBoard;
}