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

function onDragStart(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('piece')) {
        draggedElement = event.target as HTMLElement;
    }
}

function onDragDrop(event: Event) {
    event.stopPropagation();
    let targetElement = event.target as HTMLElement;
    // Make sure target is not a resource
    while (targetElement.classList.contains('untargetable')) {
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

function handleMouseEvents(event: Event, shouldAddClass: boolean) {
    let target = event.target as HTMLElement;
    const targetParentElement = target.parentNode as HTMLElement;
    if (targetParentElement.classList.contains('square')) {
        target = target.parentNode as HTMLElement;
    }
    if (target.classList.contains('square')) {
        if (shouldAddClass) {
            target.classList.add('light-gray-background');
        } else {
            target.classList.remove('light-gray-background');
        }
    }
}

function onMouseOver(event: Event) {
    handleMouseEvents(event, true);
}

function onMouseOut(event: Event) {
    handleMouseEvents(event, false);
}

export function setOnAction(_triggerOnAction: (draggedElement: HTMLElement, targetElement: HTMLElement) => void) {
    triggerOnAction = _triggerOnAction;
}

export function setOnFallOffTheBoard(_triggerOnFallOffTheBoard: (draggedElement: HTMLElement) => void) {
    triggerOnFallOffTheBoard = _triggerOnFallOffTheBoard;
}