// Constants
const boardDisplay = document.querySelector('#board-display');
const playerDisplay = document.querySelector('#player-display');
const roundCounterDisplay = document.querySelector('#round-counter-display');
const infoDisplay = document.querySelector('#info-display');

function addDragAndDropListeners() {
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
    document.body.addEventListener('drop', dragOffTheBoard);
}

let draggedElement;
function onDragStart(e) {
    if (e.target.classList.contains('piece')) {
        draggedElement = e.target;
    }
}

function onDragDrop(e) {
    e.stopPropagation();
    let target = e.target;
    // Make sure target is not a resource
    while (target.classList.contains('untargetable')) {
        target = target.parentNode;
    }
    actOnTurn(target);
    isCastling = false;
}

function onDragOver(e) {
    e.preventDefault();
}

function handleMouseEvents(e, shouldAddClass) {
    let target = e.target;
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

function onMouseOver(e) {
    handleMouseEvents(e, true);
}

function onMouseOut(e) {
    handleMouseEvents(e, false);
}

Logger.log('Game started!');
// Initialize the board
initializeBoard();
// Add event listeners
addDragAndDropListeners();