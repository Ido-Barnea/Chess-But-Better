import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { PieceHealth } from "../../../model/piece/utilities/PieceHealth";
import { Position } from "../../../model/piece/utilities/position/Position";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Pieces } from "../types/Pieces";
import { PieceUtilities } from "../utilities/PieceUtilities";

export class Knight extends BasePiece {

  constructor(team: ITeam, position: Position) {
    const resources = PieceUtilities.getPieceResources(Pieces.KNIGHT, team);
    const health = new PieceHealth(1, 1);

    super(resources, team, position, health);
  }

  getLegalMoves(_: IPiecesStorage): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Define all possible knight move offsets
    const knightMoveOffsets = [
      { deltaX: 2, deltaY: 1 },
      { deltaX: 2, deltaY: -1 },
      { deltaX: -2, deltaY: 1 },
      { deltaX: -2, deltaY: -1 },
      { deltaX: 1, deltaY: 2 },
      { deltaX: 1, deltaY: -2 },
      { deltaX: -1, deltaY: 2 },
      { deltaX: -1, deltaY: -2 },
    ];

    for (const offset of knightMoveOffsets) {
      const nextX = currentCoordinates.x + offset.deltaX;
      const nextY = currentCoordinates.y + offset.deltaY;

      // Check if the next position is within the board boundaries
      if (nextX >= 0 && nextX < 8 && nextY >= 0 && nextY < 8) {
        const nextPosition: Position = {
          coordinates: {
            x: nextX,
            y: nextY,
          },
          board: this.position.board,
        };

        // Add the position to the list of valid moves
        validMoves.push(nextPosition);
      }
    }

    return validMoves;
  }
}
