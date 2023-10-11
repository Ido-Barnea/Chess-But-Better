// Constants
const boardWidth = 8;

function initializeBoard() {
    activeRules.forEach((rule) => {
        if (rule.id === 0) isPiecesDropOffTheBoardActive = true;
    });

    document.documentElement.style.setProperty('--square-side', `calc(${boardWidth * 0.5}vw)`);

    const boardBottom = document.getElementById("board-bottom");
    const boardSide = document.getElementById("board-left");

    const letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    for(let column = 0; column < boardWidth + 1; column++) {
        const squareNotation = createNotation(letters[column]);
        boardBottom.appendChild(squareNotation);
    }

    for (let row = boardWidth; row > 0; row--) {
        const squareNotation = createNotation(row);
        boardSide.appendChild(squareNotation);
    }

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

function createNotation(notation) {
    const squareNotation = document.createElement('div');
    squareNotation.classList.add("square-notation");
    const notationElement = document.createElement('p');
    notationElement.classList.add("board-notation");
    notationElement.innerHTML = notation;
    squareNotation.appendChild(notationElement)

    return squareNotation;
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