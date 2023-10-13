import { pawnResource, bishopResource, knightResource, rookResource, queenResource, kingResource } from "./resources";
import { Player } from "./players";
import { getCurrentPlayer, switchIsCastling, getPieceByPosition } from "./logic";

interface PieceType {
    position: [number, number],
    player: Player,
    resource: string,
    name: string,
    hasMoved: boolean,
}

export class Piece implements PieceType {
    position: [number, number];
    player: Player;
    resource: string;
    name: string;
    hasMoved: boolean;

    constructor(position: [number, number], player: Player, resource: string, name: string) {
        this.position = position;
        this.player = player;
        this.resource = resource;
        this.name = name;
        this.hasMoved = false;
    }

    isValidMove(_: Piece | Square) {
        return false;
    }
}

export type Square = {
    position: [number, number],
    occupent?: Piece,
}

export class Pawn extends Piece {
    constructor(position, player) {
        super(position, player, pawnResource, 'Pawn');
    }

    isValidMove(target: Piece | Square) {
        const deltaX = target[0] - this.position[0];
        const deltaY = target[1] - this.position[1];

        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);

        const stepY = (target[1] > this.position[1]) ? 1 : (target[1] < this.position[1]) ? -1 : 0;

        // Make sure pawn does not move backwards.
        const currentPlayer = getCurrentPlayer();
        if ((currentPlayer.color === 'White' && deltaY > 0) || (currentPlayer.color === 'Black' && deltaY < 0)) {
            return false;
        }
        
        // Pawns attack diagonally.
        // Check if there is another piece on the targeted square.
        if ((target as Piece).name !== undefined) {
            const targetPiece = (target as Piece);
            const oponent = this.player.color === 'White' ? 'Black' : 'White';
            // Make sure the other piece belongs to the current player's oponent.
            if (targetPiece.player.color === oponent) {
                return absoluteDeltaY === 1 && absoluteDeltaX === 1;
            }
        }

        // Pawns can have an initial two-square move.
        if (!this.hasMoved && (absoluteDeltaY === 1 || absoluteDeltaY === 2) && absoluteDeltaX === 0) {
            return validateMove(this.position, target, 0, stepY, 2);
        }

        // Pawns move one square forward.
        return absoluteDeltaY === 1 && absoluteDeltaX === 0;
    }
}

export class Bishop extends Piece {
    constructor(position, player) {
        super(position, player, bishopResource, 'Bishop');
    }

    isValidMove(target: Piece | Square) {
        const stepX = (target[0] > this.position[0]) ? 1 : -1;
        const stepY = (target[1] > this.position[1]) ? 1 : -1;

        const absoluteDeltaX = Math.abs(target[0] - this.position[0]);
        const absoluteDeltaY = Math.abs(target[1] - this.position[1]);

        // Bishops can only move diagonally.
        if (absoluteDeltaY === absoluteDeltaX) {
            return validateMove(this.position, target, stepX, stepY, -1);
        }

        return false;
    }
}

export class Knight extends Piece {
    constructor(position, player) {
        super(position, player, knightResource, 'Knight');
    }

    isValidMove(target: Piece | Square) {
        const absoluteDeltaX = Math.abs(target[0] - this.position[0]);
        const absoluteDeltaY = Math.abs(target[1] - this.position[1]);

        // Knights can move two squares in any direction and one square to the side. 
        return absoluteDeltaY * absoluteDeltaX === 2;
    }
}

export class Rook extends Piece {
    constructor(position, player) {
        super(position, player, rookResource, 'Rook');
    }

    isValidMove(target: Piece | Square) {
        const stepX = (target[0] > this.position[0]) ? 1 : (target[0] < this.position[0]) ? -1 : 0;
        const stepY = (target[1] > this.position[1]) ? 1 : (target[1] < this.position[1]) ? -1 : 0;

        // Rooks can move either vertically or horizontally but not both at the same.
        if (this.position[1] === target[1] || this.position[0] === target[0]) {
            return validateMove(this.position, target, stepX, stepY, -1);
        }

        return false;
    }
}

export class Queen extends Piece {
    constructor(position, player) {
        super(position, player, queenResource, 'Queen');
    }

    isValidMove(target: Piece | Square) {
        const stepX = (target[0] > this.position[0]) ? 1 : (target[0] < this.position[0]) ? -1 : 0;
        const stepY = (target[1] > this.position[1]) ? 1 : (target[1] < this.position[1]) ? -1 : 0;

        const absoluteDeltaX = Math.abs(target[0] - this.position[0]);
        const absoluteDeltaY = Math.abs(target[1] - this.position[1]);

        // Queens can move vertically, horizontally or diagonally.
        if ((this.position[1] === target[1] || this.position[0] === target[0]) || absoluteDeltaY === absoluteDeltaX) {
            return validateMove(this.position, target, stepX, stepY, -1);
        }

        return false;
    }
}

export class King extends Piece {
    constructor(position, player) {
        super(position, player, kingResource, 'King');
    }

    isValidMove(target: Piece | Square) {
        const stepX = (target[0] > this.position[0]) ? 1 : (target[0] < this.position[0]) ? -1 : 0;
        const stepY = (target[1] > this.position[1]) ? 1 : (target[1] < this.position[1]) ? -1 : 0;

        const deltaX = target[0] - this.position[0];
        const deltaY = target[1] - this.position[1];

        const absoluteDeltaX = Math.abs(deltaX);
        const absoluteDeltaY = Math.abs(deltaY);

        // King can only move one step but in any direction.
        if (absoluteDeltaX === 1 || absoluteDeltaY === 1) {
            return validateMove(this.position, target, stepX, stepY, 1);
        }

        // Check for castling
        if (absoluteDeltaX === 2 && absoluteDeltaY === 0 && !this.hasMoved) { // Moved two squares horizontally and didn't move before
            switchIsCastling();
            if (deltaX === 2) { // Kingside castling
                return validateMove(this.position, target, stepX, stepY, 2);
            } else { // Queenside castling
                // Queenside castling needs to check an extra square
                const _destinationCoordinates = [target[0] - 1, target[1]];
                return validateMove(this.position, _destinationCoordinates, stepX, stepY, 3);
            }
        }

        return false;
    }
}

function validateMove(position, targetPosition, stepX, stepY, limit): boolean {
    let limitCounter = 0;
    while ((position[0] !== targetPosition[0] || position[1] !== targetPosition[1]) && limitCounter !== limit) {
        const nextPosition: [number, number] = [position[0] + stepX, position[1] + stepY];

        // Check if any square along the piece's path is occupied (not including the destination square)
        const targetPiece = getPieceByPosition(nextPosition);
        if (targetPiece && nextPosition != targetPosition) {
            return false;
        }

        position[0] += stepX;
        position[1] += stepY;
        limitCounter++;
    }

    return position === targetPosition;
}
