import { game } from '../../Game';
import { spawnPieceOnBoard } from '../../LogicAdapter';
import { permanentlyKillPiece } from '../PieceLogic';
import { comparePositions } from '../Utilities';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { PieceMovedOnItemActionHandler } from './PieceMovedOnItemActionHandler';
import { ActionHandler } from './abstract/Handler';

export class PieceSpawningActionHandler implements ActionHandler {
  private _piece: BasePiece;

  constructor (piece: BasePiece) {
    this._piece = piece;
  }
  
  handle() {
    game.getPieces().forEach((piece) => {
      const areOnTheSamePosition = comparePositions(
        this._piece.position,
        piece.position,
      );
      const areTheSame = piece === this._piece;
  
      if (areOnTheSamePosition && !areTheSame) {
        permanentlyKillPiece(piece);
      }
    });
  
    game.getItems().forEach((item) => {
      if (comparePositions(this._piece.position, item.position)) {
        new PieceMovedOnItemActionHandler(item, this._piece).handle();
      }
    });
  
    spawnPieceOnBoard(this._piece);
  }
}
