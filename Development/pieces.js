class Piece {
    constructor(position, player, resource, name) {
        this.position = position;
        this.player = player;
        this.resource = resource;
        this.name = name;
        this.hasMoved = false;
    }
}

class Pawn extends Piece {
    constructor(position, player) {
        super(position, player, pawnResource, 'Pawn');
    }

    static isValidMove(coordinates, destinationCoordinates, currentPlayer, target) {
        const deltaX = destinationCoordinates[0] - coordinates[0];
        const deltaY = destinationCoordinates[1] - coordinates[1];

        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);

        // Make sure pawn does not move backwards.
        if ((currentPlayer.color === 'white' && deltaY > 0) || (currentPlayer.color === 'black' && deltaY < 0)) {
            return false;
        }
        
        // Pawns attack diagonally.
        // Check if there is another piece on the targeted square.
        if (isSquareOccupied(target)) {
            const oponent = currentPlayer.color === 'white' ? 'black' : 'white';
            // Make sure the other piece belongs to the current player's oponent.
            if (target.classList.contains(oponent)) {
                return absoluteDeltaY === 1 && absoluteDeltaX === 1;
            }
        }

        // Pawns can have an initial two-square move.
        if (!this.hasMoved) {
            return (absoluteDeltaY === 1 || absoluteDeltaY === 2) && absoluteDeltaX === 0;
        }

        // Pawns move one square forward.
        return absoluteDeltaY === 1 && absoluteDeltaX === 0;
    }
}

class Bishop extends Piece {
    constructor(position, player) {
        super(position, player, bishopResource, 'Bishop');
    }

    static isValidMove(coordinates, destinationCoordinates) {
        const stepX = (destinationCoordinates[0] > coordinates[0]) ? 1 : -1;
        const stepY = (destinationCoordinates[1] > coordinates[1]) ? 1 : -1;

        const absoluteDeltaX = Math.abs(destinationCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(destinationCoordinates[1] - coordinates[1]);

        // Bishops can only move diagonally.
        if (absoluteDeltaY === absoluteDeltaX) {
            return attemptToMove(coordinates, destinationCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class Rook extends Piece {
    constructor(position, player) {
        super(position, player, rookResource, 'Rook');
    }

    static isValidMove(coordinates, destinationCoordinates) {
        const stepX = (destinationCoordinates[0] > coordinates[0]) ? 1 : (destinationCoordinates[0] < coordinates[0]) ? -1 : 0;
        const stepY = (destinationCoordinates[1] > coordinates[1]) ? 1 : (destinationCoordinates[1] < coordinates[1]) ? -1 : 0;

        // Rooks can move either vertically or horizontally but not both at the same.
        if (coordinates[1] === destinationCoordinates[1] || coordinates[0] === destinationCoordinates[0]) {
            return attemptToMove(coordinates, destinationCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class Knight extends Piece {
    constructor(position, player) {
        super(position, player, knightResource, 'Knight');
    }

    static isValidMove(coordinates, destinationCoordinates) {
        const absoluteDeltaX = Math.abs(destinationCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(destinationCoordinates[1] - coordinates[1]);

        // Knights can move two squares in any direction and one square to the side. 
        return absoluteDeltaY * absoluteDeltaX === 2;
    }
}

class Queen extends Piece {
    constructor(position, player) {
        super(position, player, queenResource, 'Queen');
    }

    static isValidMove(coordinates, destinationCoordinates) {
        const stepX = (destinationCoordinates[0] > coordinates[0]) ? 1 : (destinationCoordinates[0] < coordinates[0]) ? -1 : 0;
        const stepY = (destinationCoordinates[1] > coordinates[1]) ? 1 : (destinationCoordinates[1] < coordinates[1]) ? -1 : 0;

        const absoluteDeltaX = Math.abs(destinationCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(destinationCoordinates[1] - coordinates[1]);

        // Queens can move vertically, horizontally or diagonally.
        if ((coordinates[1] === destinationCoordinates[1] || coordinates[0] === destinationCoordinates[0]) || absoluteDeltaY === absoluteDeltaX) {
            return attemptToMove(coordinates, destinationCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class King extends Piece {
    constructor(position, player) {
        super(position, player, kingResource, 'King');
    }

    static isValidMove(coordinates, destinationCoordinates) {
        const stepX = (destinationCoordinates[0] > coordinates[0]) ? 1 : (destinationCoordinates[0] < coordinates[0]) ? -1 : 0;
        const stepY = (destinationCoordinates[1] > coordinates[1]) ? 1 : (destinationCoordinates[1] < coordinates[1]) ? -1 : 0;

        const absoluteDeltaX = Math.abs(destinationCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(destinationCoordinates[1] - coordinates[1]);

        // King can only move one step but in any direction.
        if (absoluteDeltaY === 1 || absoluteDeltaX === 1) {
            return attemptToMove(coordinates, destinationCoordinates, stepX, stepY, 1);
        }

        return false;
    }
}
