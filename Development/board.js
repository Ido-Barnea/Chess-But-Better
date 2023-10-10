// Constants
const boardWidth = 8;

// Variables
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
    playerDisplay.textContent = players[currentPlayerIndex].color;
    roundCounterDisplay.textContent = roundCounter;
    infoDisplay.textContent += `White: ${players[0].xp} XP; ${players[0].gold} Gold.`;
    infoDisplay.textContent += `| Black: ${players[1].xp} XP; ${players[1].gold} Gold.`;
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
    return isEvenRow ? (isEvenColumn ? 'beige-background' : 'brown-background') : (isEvenColumn ? 'brown-background' : 'beige-background');
    //return isEvenRow ? (isEvenColumn ? 'dark-orange-background' : 'dark-red-background') : (isEvenColumn ? 'dark-red-background' : 'dark-orange-background'); Hell
    //return isEvenRow ? (isEvenColumn ? 'water-background' : 'blue-background') : (isEvenColumn ? 'blue-background' : 'water-background'); Heaven
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