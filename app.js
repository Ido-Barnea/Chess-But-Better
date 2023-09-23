// Constants
const boardDisplay = document.querySelector('#board-display');
const playerDisplay = document.querySelector('#player-display');
const roundCounterDisplay = document.querySelector('#round-counter-display');
const infoDisplay = document.querySelector('#info-display');
const boardWidth = 8;
const numberOfPlayers = 2;

// Variables
let player = 'white';
let roundCounter = 1;
let turnCounter = 0;

var board = [
    rookResource, bishopResource, knightResource, queenResource, kingResource, knightResource, bishopResource, rookResource,
    pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource,
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource, pawnResource,
    rookResource, bishopResource, knightResource, queenResource, kingResource, knightResource, bishopResource, rookResource,
]

function initializeBoard(_board) {
    _board.forEach((_, index) => {
        // Create square elements and set their attributes
        const square = createSquare(index);
        boardDisplay.appendChild(square);
    });

    // Display initial information
    playerDisplay.textContent = player;
    roundCounterDisplay.textContent = roundCounter;
}

function createSquare(index) {
    const square = document.createElement('div');
    square.classList.add('square');

    // Calculate row and column based on index
    const row = Math.floor(index / boardWidth);
    const column = index % boardWidth;
    square.setAttribute('square-id', [column, row]);

    // Determine background color class
    const backgroundColor = getBackgroundColor(column, row);
    square.classList.add(backgroundColor);

    // Add starting pieces
    square.innerHTML = board[index];

    // Tint pieces
    tintPiece(square.firstChild, index);

    return square;
}

function getBackgroundColor(column, row) {
    const isEvenColumn = column % 2 === 0;
    const isEvenRow = row % 2 === 0;
    return isEvenRow ? (isEvenColumn ? 'beige' : 'brown') : (isEvenColumn ? 'brown' : 'beige');
}

function tintPiece(piece, index) {
    if (index < 16) {
        piece.firstChild.classList.add('black');
    }
    if (index > 47) {
        piece.firstChild.classList.add('white');
    }
}

function addDragAndDropListeners() {
    const squares = document.querySelectorAll('#board-display .square');
    squares.forEach((square) => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('drop', dragDrop);
    });
}

// Initialize the board and add event listeners
initializeBoard(board);
addDragAndDropListeners();



let draggedElement;

function dragStart(e) {
    if (e.target.classList.contains('piece')) {
        draggedElement = e.target;
    }
}

function dragDrop(e) {
    e.stopPropagation();
    const target = e.target;
    if (!isAllowedToMove()) return;
    if (!isValidMove(target)) return;

    // Check if there is another piece on the targeted square.
    if (isSquareOccupied(target)) {
        // Make sure the other piece belongs to the current player's oponent.
        if (isSquareOccupiedByEnemy(target)) {
            target.parentNode.append(draggedElement);
            target.remove();
        } else {
            return;
        }
    } else {
        target.append(draggedElement);
    }

    endTurn();
}

function dragOver(e) {
    e.preventDefault();
}

function isAllowedToMove() {
    const target = draggedElement.firstChild;
    return target.classList.contains(player);
}

function isSquareOccupied(targetSquare) {
    return targetSquare.classList.contains('piece');
}

function isSquareOccupiedByEnemy(targetSquare) {
    if (!isSquareOccupied(targetSquare)) return false;
    const oponent = player === 'white' ? 'black' : 'white';
    return targetSquare.firstChild.classList.contains(oponent);
}

function isValidMove(target) {
    const piece = draggedElement.id;
    const _coordinates = draggedElement.parentNode.getAttribute('square-id');
    const _targetCoordinates = target.getAttribute('square-id') || target.parentNode.getAttribute('square-id'); // Either an empty square or a piece occuping a square

    const coordinates = [Number(_coordinates[0]), Number(_coordinates[2])];
    const targetCoordinates = [Number(_targetCoordinates[0]), Number(_targetCoordinates[2])];

    switch (piece) {
        case 'pawn': {
            return Pawn.isValidMove(coordinates, targetCoordinates, player, target);
        }
        case 'bishop': {
            return Bishop.isValidMove(coordinates, targetCoordinates);
        }
        case 'knight': {
            return Knight.isValidMove(coordinates, targetCoordinates);
        }
        case 'rook': {
            return Rook.isValidMove(coordinates, targetCoordinates);
        }
        case 'queen': {
            return Queen.isValidMove(coordinates, targetCoordinates);
        }
        case 'king': {
            return King.isValidMove(coordinates, targetCoordinates);
        }
        default: {
            return false;
        }
    }
}

function attemptToMove(coordinates, targetCoordinates, stepX, stepY, limit) {
    let limitCounter = 0;
    while ((coordinates[0] !== targetCoordinates[0] || coordinates[1] !== targetCoordinates[1]) && limitCounter !== limit) {
        const nextPosition = [coordinates[0] + stepX, coordinates[1] + stepY];
        const target = document.querySelector(`[square-id="${nextPosition}"]`);
        if (isSquareOccupied(target.firstChild || target)) {
            return false;
        }
        
        coordinates[0] += stepX;
        coordinates[1] += stepY;
        limitCounter++;
    }

    return true;
}

function endTurn() {
    player = player === 'white' ? 'black' : 'white';
    turnCounter++;
    if (turnCounter % numberOfPlayers === 0) {
        turnCounter = 0;
        roundCounter++;
        roundCounterDisplay.textContent = roundCounter;
    }
    playerDisplay.textContent = player;
}
