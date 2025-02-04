import { isEqual } from "lodash";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { PieceHealth } from "../../../model/piece/utilities/PieceHealth";
import { Position } from "../../../model/piece/utilities/position/Position";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Pieces } from "../types/Pieces";
import { PieceUtilities } from "../utilities/PieceUtilities";

export class Queen extends BasePiece {

  constructor(team: ITeam, position: Position) {
    const resources = PieceUtilities.getPieceResources(Pieces.QUEEN, team);
    const health = new PieceHealth(1, 1);

    super(resources, team, position, health);
  }

  getLegalMoves(piecesStorage: IPiecesStorage): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Iterate over all possible directions for the queen
    const directions = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: -1, deltaY: -1 },
      { deltaX: 1, deltaY: -1 },
      { deltaX: -1, deltaY: 1 },
    ];

    for (const direction of directions) {
      let stepX = direction.deltaX;
      let stepY = direction.deltaY;

      // Iterate until the edge of the board
      while (true) {
        const nextX = currentCoordinates.x + stepX;
        const nextY = currentCoordinates.y + stepY;

        // Check if the next position is within the board boundaries
        if (nextX < 0 || nextX >= 8 || nextY < 0 || nextY >= 8) {
          break;
        }

        const nextPosition: Position = {
          coordinates: {
            x: nextX,
            y: nextY,
          },
          board: this.position.board,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);

        // If the move encounters another piece, stop iterating in this direction
        if (piecesStorage.getPieces((piece) => isEqual(piece.position, nextPosition))) {
          break;
        }

        // Move further in the current direction
        stepX += direction.deltaX;
        stepY += direction.deltaY;
      }
    }

    return validMoves;
  }
}
