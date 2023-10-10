// Constants
const boardWidth = 8;
const pieces = [
    new Rook([0,0], players[1]),
    new Bishop([1, 0], players[1]),
    new Knight([2, 0], players[1]),
    new Queen([3, 0], players[1]),
    new King([4, 0], players[1]),
    new Knight([5, 0], players[1]),
    new Bishop([6, 0], players[1]),
    new Rook([7, 0], players[1]),
    new Pawn([0,1], players[1]),
    new Pawn([1, 1], players[1]),
    new Pawn([2, 1], players[1]),
    new Pawn([3, 1], players[1]),
    new Pawn([4, 1], players[1]),
    new Pawn([5, 1], players[1]),
    new Pawn([6, 1], players[1]),
    new Pawn([7, 1], players[1]),
    new Pawn([0,6], players[0]),
    new Pawn([1, 6], players[0]),
    new Pawn([2, 6], players[0]),
    new Pawn([3, 6], players[0]),
    new Pawn([4, 6], players[0]),
    new Pawn([5, 6], players[0]),
    new Pawn([6, 6], players[0]),
    new Pawn([7, 6], players[0]),
    new Rook([0,7], players[0]),
    new Bishop([1, 7], players[0]),
    new Knight([2, 7], players[0]),
    new Queen([3, 7], players[0]),
    new King([4, 7], players[0]),
    new Knight([5, 7], players[0]),
    new Bishop([6, 7], players[0]),
    new Rook([7, 7], players[0]),
]

function initializeBoard() {
    activeRules.forEach((rule) => {
        if (rule.id === 0) isPiecesDropOffTheBoardActive = true;
    });

    for (let row = 0; row < boardWidth; row++) {
        for (let column = 0; column < boardWidth; column++) {
            // Create square elements and set their attributes
            const square = createSquare([column, row]);
            boardDisplay.appendChild(square);
        }
    }

    pieces.forEach((piece) => {
        // Add starting pieces
        const pieceElement = createPieceElement(piece);
        const square = document.querySelectorAll(`[square-id="${piece.position}"]`)[0];
        square.appendChild(pieceElement);
    });

    // Display initial information
    playerDisplay.textContent = players[currentPlayerIndex].color;
    roundCounterDisplay.textContent = roundCounter;
    infoDisplay.textContent += `White: ${players[0].xp} XP; ${players[0].gold} Gold.`;
    infoDisplay.textContent += `| Black: ${players[1].xp} XP; ${players[1].gold} Gold.`;
}

function createSquare(position) {
    const square = document.createElement('div');
    square.classList.add('square');

    // Set the square-id to the position of the square
    square.setAttribute('square-id', position);

    // Determine background color class
    const backgroundColor = getBackgroundColor(position);
    square.classList.add(backgroundColor);

    return square;
}

function getBackgroundColor(position) {
    const isEvenColumn = position[0] % 2 === 0;
    const isEvenRow = position[1] % 2 === 0;
    return isEvenRow ? (isEvenColumn ? 'beige-background' : 'brown-background') : (isEvenColumn ? 'brown-background' : 'beige-background');
    //return isEvenRow ? (isEvenColumn ? 'dark-orange-background' : 'dark-red-background') : (isEvenColumn ? 'dark-red-background' : 'dark-orange-background'); Hell
    //return isEvenRow ? (isEvenColumn ? 'water-background' : 'blue-background') : (isEvenColumn ? 'blue-background' : 'water-background'); Heaven
}

function createPieceElement(piece) {
    const pieceElement = document.createElement('div');
    pieceElement.classList.add('piece');
    pieceElement.setAttribute('draggable', true);
    pieceElement.setAttribute('id', piece.name);

    // Add class for the piece color
    pieceElement.classList.add(piece.player.color);

    // Set the inner HTML to the piece character
    pieceElement.innerHTML = piece.resource;

    return pieceElement;
}