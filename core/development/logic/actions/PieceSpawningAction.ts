import { game } from '../../Game';
import { spawnPieceOnBoard } from '../../LogicAdapter';
import { permanentlyKillPiece } from '../PieceLogic';
import { comparePositions } from '../Utilities';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { PieceOnItemAction as PieceOnItemAction } from './PieceOnItemAction';
import { Action } from './abstract/Action';

export class PieceSpawningAction implements Action {
  private _piece: BasePiece;

  constructor(piece: BasePiece) {
    this._piece = piece;
  }

  execute() {
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
        new PieceOnItemAction(item, this._piece).execute();
      }
    });

    spawnPieceOnBoard(this._piece);
  }
}
