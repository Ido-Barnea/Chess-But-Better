import { isEqual } from "lodash";
import { BasePiece } from "../../../model/piece/abstract/BasePiece";
import { PieceHealth } from "../../../model/piece/utilities/PieceHealth";
import { Position } from "../../../model/piece/utilities/position/Position";
import { TeamType } from "../../../model/player/team/TeamTypes";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { ITurnCounter } from "../../game-state/counters/turn-counter/abstract/ITurnCounter";
import { IPiecesStorage } from "../../storages/pieces-storage/abstract/IPiecesStorage";
import { Pieces } from "../types/Pieces";
import { PieceUtilities } from "../utilities/PieceUtilities";

export class Pawn extends BasePiece {
  turnCounter: ITurnCounter;

  public possibleEnPassantPositions: [Position, Position] | undefined;
  public isInitialDoubleStep: boolean;
  public diagonalAttackPosition: Position | undefined;

  constructor(team: ITeam, position: Position, turnCounter: ITurnCounter) {
    const resources = PieceUtilities.getPieceResources(Pieces.PAWN, team);
    const health = new PieceHealth(1, 1);

    super(resources, team, position, health);

    this.turnCounter = turnCounter;

    this.possibleEnPassantPositions = undefined;
    this.isInitialDoubleStep = false;
    this.diagonalAttackPosition = undefined;
  }

  private getEnPassantPiece(targetPosition: Position, piecesStorage: IPiecesStorage): BasePiece | undefined {
    const pawns = piecesStorage.getPieces((piece) => {
      return piece instanceof Pawn && piece !== this;
    }) as Array<Pawn>;
    if (!pawns.length) return;

    const enPassantPawns = pawns.filter((pawn) => {
      if (pawn.isInitialDoubleStep && pawn.possibleEnPassantPositions) {
        return isEqual(pawn.possibleEnPassantPositions[0], targetPosition);
      }
    });
    if (!enPassantPawns.length) return;

    return enPassantPawns[0];
  }

  getLegalMoves(piecesStorage: IPiecesStorage): Array<Position> {
    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;
    const currentPlayer = this.turnCounter.getCurrentPlayer();

    // Determine the direction of pawn movement based on the player's color
    const stepY = currentPlayer.team.name === TeamType.WHITE ? -1 : 1;

    // Check one square forward
    const oneSquareForward: Position = {
      coordinates: {
        x: currentCoordinates.x,
        y: currentCoordinates.y + stepY,
      },
      board: this.position.board,
    };

    if (piecesStorage.getPieces((piece) => isEqual(piece.position, oneSquareForward)).length === 0) {
      validMoves.push(oneSquareForward);

      // Check two squares forward for the initial move
      if (this.stats.tilesMoved === 0) {
        const twoSquaresForward: Position = {
          coordinates: {
            x: currentCoordinates.x,
            y: currentCoordinates.y + 2 * stepY,
          },
          board: this.position.board,
        };

        if (
          piecesStorage.getPieces((piece) => isEqual(piece.position, twoSquaresForward)).length === 0 &&
          piecesStorage.getPieces((piece) => isEqual(piece.position, oneSquareForward)).length === 0
        ) {
          this.possibleEnPassantPositions = [
            oneSquareForward,
            twoSquaresForward,
          ];
          validMoves.push(twoSquaresForward);
        }
      }
    }

    // Check diagonal attacks
    const leftDiagonal: Position = {
      coordinates: {
        x: currentCoordinates.x - 1,
        y: currentCoordinates.y + stepY,
      },
      board: this.position.board,
    };

    const rightDiagonal: Position = {
      coordinates: {
        x: currentCoordinates.x + 1,
        y: currentCoordinates.y + stepY,
      },
      board: this.position.board,
    };

    if (
      piecesStorage.getPieces((piece) => isEqual(piece.position, leftDiagonal)).length > 0 ||
      this.getEnPassantPiece(leftDiagonal, piecesStorage)
    ) {
      this.diagonalAttackPosition = leftDiagonal;
      validMoves.push(leftDiagonal);
    }

    if (
      piecesStorage.getPieces((piece) => isEqual(piece.position, rightDiagonal)).length > 0 ||
      this.getEnPassantPiece(rightDiagonal, piecesStorage)
    ) {
      this.diagonalAttackPosition = rightDiagonal;
      validMoves.push(rightDiagonal);
    }

    return validMoves;
  }
}
