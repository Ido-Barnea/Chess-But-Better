// Constants
const players = [new Player('white', 0, 0), new Player('black', 0, 0)];
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

// Variables
let currentPlayerIndex = 0;
let roundCounter = 1;
let turnCounter = 0;
let isPiecesDropOffTheBoardActive = false;
let isCastling = false;

function isAllowedToMove() {
    return draggedElement.classList.contains(players[currentPlayerIndex].color);
}

function isSquareOccupied(target) {
    return target.classList.contains('piece');
}

function isSquareOccupiedByAlly(target) {
    if (!isSquareOccupied(target)) return false;
    return target.classList.contains(players[currentPlayerIndex].color);
}

function actOnTurn(target) {
    if (!isAllowedToMove()) return;
    if (!isValidMove(target)) return;

    // Check if there is another piece on the targeted square.
    if (isSquareOccupied(target)) {
        if (isSquareOccupiedByAlly(target)) {
            isFriendlyFire = true;
        }
        MoveAndKillEnemyPiece(target);
    } else {
        if (isCastling) {
            castle(target);
        }
        move(draggedElement, target);
    }

    endTurn();
}

function isValidMove(target) {
    const piece = draggedElement.id;
    const _coordinates = draggedElement.parentNode.getAttribute('square-id');
    const _targetCoordinates = target.getAttribute('square-id') || target.parentNode.getAttribute('square-id'); // Either an empty square or a piece occuping a square

    const coordinates = [Number(_coordinates[0]), Number(_coordinates[2])];
    const destinationCoordinates = [Number(_targetCoordinates[0]), Number(_targetCoordinates[2])];
    
    switch (piece) {
        case 'Pawn': {
            return Pawn.isValidMove(coordinates, destinationCoordinates, players[currentPlayerIndex], target);
        }
        case 'Bishop': {
            return Bishop.isValidMove(coordinates, destinationCoordinates);
        }
        case 'Knight': {
            return Knight.isValidMove(coordinates, destinationCoordinates);
        }
        case 'Rook': {
            return Rook.isValidMove(coordinates, destinationCoordinates);
        }
        case 'Queen': {
            return Queen.isValidMove(coordinates, destinationCoordinates);
        }
        case 'King': {
            return King.isValidMove(coordinates, destinationCoordinates);
        }
        default: {
            return false;
        }
    }
}

function attemptToMove(coordinates, destinationCoordinates, stepX, stepY, limit) {
    let limitCounter = 0;
    while ((coordinates[0] !== destinationCoordinates[0] || coordinates[1] !== destinationCoordinates[1]) && limitCounter !== limit) {
        const nextPosition = [coordinates[0] + stepX, coordinates[1] + stepY];
        const target = document.querySelector(`[square-id="${nextPosition}"]`);

        // Check if any square along the piece's path is occupied (not including the destination square)
        const targetSquarePosition = target.getAttribute('square-id').split(',');
        if (isSquareOccupied(target.firstChild || target) &&
            targetSquarePosition[0] != destinationCoordinates[0] &&
            targetSquarePosition[1] != destinationCoordinates[1]
        ) {
            return false;
        }
        coordinates[0] += stepX;
        coordinates[1] += stepY;
        limitCounter++;
    }

    return coordinates[0] === destinationCoordinates[0] && coordinates[1] === destinationCoordinates[1];
}

function MoveAndKillEnemyPiece(target) {
    Logger.log(`${target.classList.contains('white') ? 'white' : 'black'} ${target.id} was killed by ${players[currentPlayerIndex].color} ${draggedElement.id}.`);
    const piece = pieces.find((piece) => piece.position == draggedElement.parentNode.getAttribute('square-id')); // Get piece object
    target.parentNode.append(draggedElement);
    target.remove();
    piece.position = draggedElement.parentNode.getAttribute('square-id').split(','); // Update piece's position
    piece.hasMoved = true;
    deathCounter++;
    deathTrigger = true;
}

function move(pieceElement, target) {
    Logger.log(`${players[currentPlayerIndex].color} ${pieceElement.id} moved from (${pieceElement.parentNode.getAttribute('square-id')}) to (${target.getAttribute('square-id')}).`);
    const piece = pieces.find((piece) => piece.position == pieceElement.parentNode.getAttribute('square-id')); // Get piece object
    target.append(pieceElement); // Move piece's element
    piece.position = pieceElement.parentNode.getAttribute('square-id').split(','); // Update piece's position
    piece.hasMoved = true;
}

function castle(target) {
    const possibleRooks = pieces.filter((piece) => {
        return piece.player === players[currentPlayerIndex] &&
            !piece.hasMoved &&
            piece.name === 'Rook';
    });

    const targetXPosition = Number(target.getAttribute('square-id').split(',')[0]);
    const kingSquare = draggedElement.parentNode;
    const kingPosition = kingSquare.getAttribute('square-id').split(',');
    const kingXPosition = Number(kingPosition[0]);
    const kingYPosition = Number(kingPosition[1]);

    const deltaX = targetXPosition - kingXPosition;

    // Depends on if it's Kingside or Queenside castling
    const rookFilter = (piece) => deltaX > 0 ? piece.position[0] > targetXPosition : piece.position[0] < targetXPosition;
    const rook = possibleRooks.find(rookFilter);

    const rookElement = document.querySelector(`[square-id="${rook.position}"]`).firstChild;
    const rookTargetPosition = [deltaX > 0 ? targetXPosition - 1 : targetXPosition + 1, kingYPosition];
    const rookTarget = document.querySelector(`[square-id="${rookTargetPosition}"]`);
    move(rookElement, rookTarget);
}

function dragOffTheBoard(e) {
    if (isPiecesDropOffTheBoardActive && isAllowedToMove()) {
        fellOffTheBoard = draggedElement;
        deathCounter++;
        deathTrigger = true;
        endTurn();
    }
}

function endTurn() {
    // Check if any rule is triggered
    activeRules.forEach((rule) => {
        rule.apply();
    });

    infoDisplay.textContent = '';
    infoDisplay.textContent += `White: ${players[0].xp} XP; ${players[0].gold} Gold.`;
    infoDisplay.textContent += `| Black: ${players[1].xp} XP; ${players[1].gold} Gold.`;

    currentPlayerIndex = Number(!currentPlayerIndex); // Switch players
    turnCounter++; // Advance turn counter

    // Check if a round has passed
    if (turnCounter % players.length === 0) {
        turnCounter = 0;
        roundCounter++;
        roundCounterDisplay.textContent = roundCounter; // Update information
    }
    playerDisplay.textContent = players[currentPlayerIndex].color; // Update information
}