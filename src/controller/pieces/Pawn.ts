import { pawnResource } from '../../view/resources/Resources';
import { Player } from '../game state/storages/players storage/Player';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Position } from '../../model/types/Position';
import { PieceResource } from '../../model/pieces/PieceResource';
import { PieceStats } from '../../model/pieces/PieceStats';
import { PieceModifiers } from '../../model/pieces/PieceModifiers';
import { IPiecesStorage } from '../game state/storages/pieces storage/abstract/IPiecesStorage';
import { isEqual } from 'lodash';
import { ITurnSwitcher } from '../game state/switchers/turn switcher/abstract/ITurnSwitcher';

export class Pawn extends BasePiece {
  private turnSwitcher: ITurnSwitcher;
  
  public possibleEnPassantPositions: [Position, Position] | undefined;
  public isInitialDoubleStep: boolean;
  public diagonalAttackPosition: Position | undefined;

  constructor(player: Player, turnSwitcher: ITurnSwitcher, position?: Position) {
    const icon = player.color === PlayerColor.WHITE ? '♙' : '♟';
    super(
      new PieceResource(pawnResource, icon, 'Pawn'),
      new PieceStats(1, 1, 1),
      new PieceModifiers(),
      player,
      position,
    );

    this.possibleEnPassantPositions = undefined;
    this.isInitialDoubleStep = false;
    this.diagonalAttackPosition = undefined;

    this.turnSwitcher = turnSwitcher;
  }

  getEnPassantPiece(targetPosition: Position, piecesStorage: IPiecesStorage): BasePiece | undefined {
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
    if (!this.position) return [];

    const validMoves: Array<Position> = [];
    const currentCoordinates = this.position.coordinates;
    const currentPlayer = this.turnSwitcher.getCurrentPlayer();

    // Determine the direction of pawn movement based on the player's color
    const stepY = currentPlayer.color === PlayerColor.WHITE ? -1 : 1;

    // Check one square forward
    const oneSquareForward: Position = {
      coordinates: {
        x: currentCoordinates.x,
        y: currentCoordinates.y + stepY,
      },
      boardId: this.position.boardId,
    };

    if (piecesStorage.getPieces((piece) => isEqual(piece.position, oneSquareForward)).length === 0) {
      validMoves.push(oneSquareForward);

      // Check two squares forward for the initial move
      if (!this.modifiers.hasMoved) {
        const twoSquaresForward: Position = {
          coordinates: {
            x: currentCoordinates.x,
            y: currentCoordinates.y + 2 * stepY,
          },
          boardId: this.position.boardId,
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
      boardId: this.position.boardId,
    };

    const rightDiagonal: Position = {
      coordinates: {
        x: currentCoordinates.x + 1,
        y: currentCoordinates.y + stepY,
      },
      boardId: this.position.boardId,
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
