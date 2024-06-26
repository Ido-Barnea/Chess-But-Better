import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { game } from '../../Game';
import { destroyPieceOnBoard } from '../../LogicAdapter';
import { King } from '../pieces/King';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class PermanentlyKillPieceAction implements GameAction {
  protected killedPiece: BasePiece;

  constructor(killedPiece: BasePiece) {
    this.killedPiece = killedPiece;
  }

  execute(): ActionResult {
    this.killedPiece.position = undefined;
    const filteredPieces = game
      .getPieces()
      .filter((piece) => piece !== this.killedPiece);
    game.setPieces(filteredPieces);

    if (this.killedPiece instanceof King) {
      game.end();
    }

    game.increaseDeathCounter();
    destroyPieceOnBoard(this.killedPiece);
    return ActionResult.SUCCESS;
  }
}
