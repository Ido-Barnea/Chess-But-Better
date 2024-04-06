import { game } from '../../Game';
import { destroyPieceOnBoard, endGame } from '../../LogicAdapter';
import { King } from '../pieces/King';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class PermanentlyKillPieceAction implements GameAction {
  protected killedPiece: BasePiece;

  constructor(killedPiece: BasePiece) {
    this.killedPiece = killedPiece;
  }

  execute(): ActionResult {
    this.killedPiece.position = undefined;
    const filteredPieces = game.getPieces().filter((piece) => piece !== this.killedPiece);
    game.setPieces(filteredPieces);

    if (this.killedPiece instanceof King) endGame();

    game.increaseDeathCounter();
    destroyPieceOnBoard(this.killedPiece);
    return ActionResult.SUCCESS;
  }
}
