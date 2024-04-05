import { OVERWORLD_BOARD_ID, VOID_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { destroyPieceOnBoard, endGame } from '../../LogicAdapter';
import { King } from '../pieces/King';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { SpawnPieceInHeavenAction } from './SpawnPieceInHeavenAction';
import { SpawnPieceInHellAction } from './SpawnPieceInHellAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class KillPieceAction implements GameAction {
  protected killedPiece: BasePiece;

  constructor(killedPiece: BasePiece) {
    this.killedPiece = killedPiece;
  }

  execute(): ActionResult {
    const originBoardId = this.killedPiece.position?.boardId;

    if (this.killedPiece.position?.boardId === OVERWORLD_BOARD_ID) {
      if (this.killedPiece.killCount > 0 || this.killedPiece instanceof King) {
        new SpawnPieceInHellAction(this.killedPiece).execute();
      } else {
        new SpawnPieceInHeavenAction(this.killedPiece).execute();
      }
    } else {
      if (!this.killedPiece.position) return ActionResult.FAILURE;
      game.increaseDeathCounter();

      this.killedPiece.position.boardId = VOID_BOARD_ID;
      game.setPieces(game.getPieces().filter((piece) => piece !== this.killedPiece));

      if (this.killedPiece instanceof King) endGame();
    }

    game.increaseDeathCounter();
    destroyPieceOnBoard(this.killedPiece, originBoardId);
    return ActionResult.SUCCESS;
  }
}
