// Constants
const boardDisplay = document.querySelector('#board-display');
const playerDisplay = document.querySelector('#player-display');
const roundCounterDisplay = document.querySelector('#round-counter-display');
const infoDisplay = document.querySelector('#info-display');
const boardWidth = 8;
const players = [new Player('white', 0, 0), new Player('black', 0, 0)];

// Variables
let currentPlayer = 'white';
let roundCounter = 1;
let turnCounter = 0;
let isPiecesDropOffTheBoardActive = false;

var board = [
    'r', 'b', 'n', 'q', 'k', 'n', 'b', 'r',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    '', '',  '', '', '', '', '', '',
    'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
    'R', 'B', 'N', 'Q', 'K', 'N', 'B', 'R',
]

function initializeBoard(_board) {
    activeRules.forEach((rule) => {
        if (rule.id === 0) isPiecesDropOffTheBoardActive = true;
    });

    _board.forEach((_, index) => {
        // Create square elements and set their attributes
        const square = createSquare(index);
        boardDisplay.appendChild(square);
    });

    // Display initial information
    playerDisplay.textContent = currentPlayer;
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
    const piece = createPiece(board[index]);
    if (piece !== null) {
        square.appendChild(piece);
    }

    return square;
}

function getBackgroundColor(column, row) {
    const isEvenColumn = column % 2 === 0;
    const isEvenRow = row % 2 === 0;
    return isEvenRow ? (isEvenColumn ? 'beige' : 'brown') : (isEvenColumn ? 'brown' : 'beige');
}

function createPiece(piece) {
    if (piece == '') return null;

    const pieceElement = document.createElement('div');
    pieceElement.classList.add('piece');
    pieceElement.setAttribute('draggable', true);
    pieceElement.setAttribute('id', getPieceType(piece));

    // Add class for the piece color
    pieceElement.classList.add(getPieceColor(piece));

    // Set the inner HTML to the piece character
    pieceElement.innerHTML = getPieceResource(piece);

    return pieceElement;
}

function getPieceColor(piece) {
    return piece.toLowerCase() == piece ? 'black' : 'white';
}

function getPieceType(piece) {
    return piece;
}

function getPieceResource(piece) {
    switch (piece.toLowerCase()) {
        case 'p': {
            return pawnResource;
        }
        case 'b': {
            return bishopResource;
        }
        case 'n': {
            return knightResource;
        }
        case 'r': {
            return rookResource;
        }
        case 'q': {
            return queenResource;
        }
        case 'k': {
            return kingResource;
        }
        default: {
            return '';
        }
    }
}

function addDragAndDropListeners() {
    const squares = document.querySelectorAll('#board-display .square');
    squares.forEach((square) => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('drop', dragDrop);
    });

    // Support pieces falling off the board
    document.body.addEventListener('dragover', dragOver);
    document.body.addEventListener('drop', dragOffTheBoard);
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
            killEnemyPiece(target);
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

function dragOffTheBoard(e) {
    if (isPiecesDropOffTheBoardActive && isAllowedToMove()) {
        fellOffTheBoard = draggedElement;
        endTurn();
    }
}

function isAllowedToMove() {
    return draggedElement.classList.contains(currentPlayer);
}

function isSquareOccupied(target) {
    return target.classList.contains('piece');
}

function isSquareOccupiedByEnemy(target) {
    if (!isSquareOccupied(target)) return false;
    const oponent = currentPlayer === 'white' ? 'black' : 'white';
    return target.classList.contains(oponent);
}

function isValidMove(target) {
    const piece = draggedElement.id.toLowerCase();
    const _coordinates = draggedElement.parentNode.getAttribute('square-id');
    const _targetCoordinates = target.getAttribute('square-id') || target.parentNode.getAttribute('square-id'); // Either an empty square or a piece occuping a square

    const coordinates = [Number(_coordinates[0]), Number(_coordinates[2])];
    const targetCoordinates = [Number(_targetCoordinates[0]), Number(_targetCoordinates[2])];
    
    switch (piece) {
        case 'p': {
            return Pawn.isValidMove(coordinates, targetCoordinates, currentPlayer, target);
        }
        case 'b': {
            return Bishop.isValidMove(coordinates, targetCoordinates);
        }
        case 'n': {
            return Knight.isValidMove(coordinates, targetCoordinates);
        }
        case 'r': {
            return Rook.isValidMove(coordinates, targetCoordinates);
        }
        case 'q': {
            return Queen.isValidMove(coordinates, targetCoordinates);
        }
        case 'k': {
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

function killEnemyPiece(target) {
    console.log(`${currentPlayer === 'white' ? 'black' : 'white'} ${target.id} was killed by ${currentPlayer} ${draggedElement.id}.`);
    target.parentNode.append(draggedElement);
    target.remove();
    hasAnyoneDied = true;
}

function endTurn() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white'; // Switch players
    turnCounter++; // Advance turn counter

    // Check if a round has passed
    if (turnCounter % players.length === 0) {
        turnCounter = 0;
        roundCounter++;
        roundCounterDisplay.textContent = roundCounter; // Update information
    }
    playerDisplay.textContent = currentPlayer; // Update information

    // Check if any rule is triggered
    activeRules.forEach((rule) => {
        rule.apply(board);
    });
}
