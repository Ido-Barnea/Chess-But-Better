class Pawn {
    static isValidMove(coordinates, targetCoordinates, color, target) {
        const deltaX = targetCoordinates[0] - coordinates[0];
        const deltaY = targetCoordinates[1] - coordinates[1];

        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);

        // Make sure pawn does not move backwards.
        if ((color === 'white' && deltaY > 0) || (color === 'black' && deltaY < 0)) {
            return false;
        }
        
        // Pawns attack diagonally.
        // Check if there is another piece on the targeted square.
        if (isSquareOccupied(target)) {
            const oponent = color === 'white' ? 'black' : 'white';
            // Make sure the other piece belongs to the current player's oponent.
            if (target.firstChild.classList.contains(oponent)) {
                return absoluteDeltaY === 1 && absoluteDeltaX === 1;
            }
        }

        // Pawns can have an initial two-square move.
        if ((color === 'white' && coordinates[1] == 6) || (color === 'black' && coordinates[1] == 1)) {
            return (absoluteDeltaY === 1 || absoluteDeltaY === 2) && absoluteDeltaX === 0
        }

        // Pawns move one square forward.
        return absoluteDeltaY === 1 && absoluteDeltaX === 0;

        return true;
    }
}

class Bishop {
    static isValidMove(coordinates, targetCoordinates) {
        const stepX = (targetCoordinates[0] > coordinates[0]) ? 1 : -1;
        const stepY = (targetCoordinates[1] > coordinates[1]) ? 1 : -1;

        const absoluteDeltaX = Math.abs(targetCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(targetCoordinates[1] - coordinates[1]);

        // Bishops can only move diagonally.
        if (absoluteDeltaY === absoluteDeltaX) {
            return attemptToMove(coordinates, targetCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class Rook {
    static isValidMove(coordinates, targetCoordinates) {
        const stepX = (targetCoordinates[0] > coordinates[0]) ? 1 : (targetCoordinates[0] < coordinates[0]) ? -1 : 0;
        const stepY = (targetCoordinates[1] > coordinates[1]) ? 1 : (targetCoordinates[1] < coordinates[1]) ? -1 : 0;

        // Rooks can move either vertically or horizontally but not both at the same.
        if (coordinates[1] === targetCoordinates[1] || coordinates[0] === targetCoordinates[0]) {
            return attemptToMove(coordinates, targetCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class Knight {
    static isValidMove(coordinates, targetCoordinates) {
        const absoluteDeltaX = Math.abs(targetCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(targetCoordinates[1] - coordinates[1]);

        // Knights can move two squares in any direction and one square to the side. 
        return absoluteDeltaY * absoluteDeltaX === 2;
    }
}

class Queen {
    static isValidMove(coordinates, targetCoordinates) {
        const stepX = (targetCoordinates[0] > coordinates[0]) ? 1 : (targetCoordinates[0] < coordinates[0]) ? -1 : 0;
        const stepY = (targetCoordinates[1] > coordinates[1]) ? 1 : (targetCoordinates[1] < coordinates[1]) ? -1 : 0;

        const absoluteDeltaX = Math.abs(targetCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(targetCoordinates[1] - coordinates[1]);

        // Queens can move vertically, horizontally or diagonally.
        if ((absoluteDeltaY + absoluteDeltaX === Math.abs(absoluteDeltaY - absoluteDeltaX)) || absoluteDeltaY === absoluteDeltaX) {
            return attemptToMove(coordinates, targetCoordinates, stepX, stepY, -1);
        }

        return false;
    }
}

class King {
    static isValidMove(coordinates, targetCoordinates) {
        const stepX = (targetCoordinates[0] > coordinates[0]) ? 1 : (targetCoordinates[0] < coordinates[0]) ? -1 : 0;
            const stepY = (targetCoordinates[1] > coordinates[1]) ? 1 : (targetCoordinates[1] < coordinates[1]) ? -1 : 0;

        const absoluteDeltaX = Math.abs(targetCoordinates[0] - coordinates[0]);
        const absoluteDeltaY = Math.abs(targetCoordinates[1] - coordinates[1]);

        // King can only move one step but in any direction.
        if (absoluteDeltaY === 1 || absoluteDeltaX === 1) {
            return attemptToMove(coordinates, targetCoordinates, stepX, stepY, 1);
        }

        return false;
    }
}
