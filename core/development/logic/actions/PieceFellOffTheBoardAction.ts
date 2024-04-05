import { VOID_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { killPieceByGame } from '../PieceLogic';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Action } from './abstract/Action';

export class PieceFellOffTheBoardAction implements Action {
  private KILL_CAUSE = 'the void';

  private _piece: BasePiece;

  constructor(piece: BasePiece) {
    this._piece = piece;
  }

  execute() {
    if (!this._piece.position) return;

    this._piece.position.boardId = VOID_BOARD_ID;
    killPieceByGame(this._piece, this.KILL_CAUSE);

    game.setFellOffTheBoardPiece(this._piece);
    game.endMove(false);
  }
}
