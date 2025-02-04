import { isEqual } from "lodash";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { PieceHealth } from "../../../model/piece/utilities/PieceHealth";
import { Position } from "../../../model/piece/utilities/position/Position";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Pieces } from "../types/Pieces";
import { PieceUtilities } from "../utilities/PieceUtilities";
import { TeamType } from "../../../model/player/team/TeamTypes";
import { Rook } from "./Rook";
import { Coordinates } from "../../../model/piece/utilities/position/Coordinates";
import { BaseBoard } from "../../../model/board/abstract/BaseBoard";

export class King extends BasePiece {

  constructor(team: ITeam, position: Position) {
    const resources = PieceUtilities.getPieceResources(Pieces.KING, team);
    const health = new PieceHealth(1, 1);

    super(resources, team, position, health);
  }

  getRookForCastling(team: ITeam, kingside: boolean, piecesStorage: IPiecesStorage): Rook | undefined {
    const rank = team.name === TeamType.WHITE ? 7 : 0;
    if (!this.position) return;

    if (kingside) {
      // Kingside castling
      const kingsideCastlingRookXCoordinate = 7;
      const kingsideRookPosition: Position = {
        coordinates: {
          x: kingsideCastlingRookXCoordinate,
          y: rank,
        },
        board: this.position.board,
      };

      const validRooks = piecesStorage.getPieces((piece) => isEqual(piece.position, kingsideRookPosition));
      return validRooks ? validRooks[0] as Rook : undefined;
    } else {
      // Queenside castling
      const queensideCastlingRookXCoordinate = 0;
      const queensideRookPosition: Position = {
        coordinates: {
          x: queensideCastlingRookXCoordinate,
          y: rank,
        },
        board: this.position.board,
      };

      const validRooks = piecesStorage.getPieces((piece) => isEqual(piece.position, queensideRookPosition));
      return validRooks ? validRooks[0] as Rook : undefined;
    }
  }

  private validatePosition(coordinates: Coordinates, board: BaseBoard, piecesStorage: IPiecesStorage): boolean {
    const currentPosition: Position = {
      coordinates,
      board,
    };

    return !(piecesStorage.getPieces((piece) => isEqual(piece.position, currentPosition)));
  }

  isPathClear(start: Position, end: Position, piecesStorage: IPiecesStorage): boolean {
    const deltaX = Math.sign(end.coordinates.x - start.coordinates.x);
    const deltaY = Math.sign(end.coordinates.y - start.coordinates.y);
    if (!this.position) return false;
    let currentX = start.coordinates.x + deltaX;
    let currentY = start.coordinates.y + deltaY;

    while (currentX !== end.coordinates.x || currentY !== end.coordinates.y) {
      if (this.validatePosition({x: currentX, y: currentY}, this.position.board, piecesStorage)) {
        return false;
      }

      currentX += deltaX;
      currentY += deltaY;
    }

    if (this.validatePosition({x: currentX, y: currentY}, this.position.board, piecesStorage)) {
      return false;
    }

    return true;
  }

  getLegalMoves(piecesStorage: IPiecesStorage): Array<Position> {
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;

    // Define possible directions for the king to move
    const directions = [
      { deltaX: 1, deltaY: 0 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: 0, deltaY: 1 },
      { deltaX: -1, deltaY: 1 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: -1, deltaY: -1 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: 1, deltaY: -1 },
    ];

    for (const direction of directions) {
      const nextX = currentCoordinates.x + direction.deltaX;
      const nextY = currentCoordinates.y + direction.deltaY;

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

    // Check for castling
    if (this.stats.tilesMoved === 0) {
      const kingsideRook = this.getRookForCastling(this.team, true, piecesStorage);
      const queensideRook = this.getRookForCastling(this.team, false, piecesStorage);

      // Kingside castling
      if (kingsideRook && kingsideRook.stats.tilesMoved === 0) {
        const kingsideTargetPosition: Position = {
          coordinates: {
            x: currentCoordinates.x + 2,
            y: currentCoordinates.y,
          },
          board: this.position.board,
        };
        if (this.isPathClear(this.position, kingsideTargetPosition, piecesStorage)) {
          validMoves.push(kingsideTargetPosition);
        }
      }

      // Queenside castling
      if (queensideRook && queensideRook.stats.tilesMoved === 0) {
        const queensideTargetPosition: Position = {
          coordinates: {
            x: currentCoordinates.x - 2,
            y: currentCoordinates.y,
          },
          board: this.position.board,
        };
        if (this.isPathClear(this.position, queensideTargetPosition, piecesStorage)) {
          validMoves.push(queensideTargetPosition);
        }
      }
    }

    return validMoves;
  }
}
