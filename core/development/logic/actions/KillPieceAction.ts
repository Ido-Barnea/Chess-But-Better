import { OVERWORLD_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { destroyPieceOnBoard } from '../../LogicAdapter';
import { King } from '../pieces/King';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { SpawnPieceInHeavenAction } from './SpawnPieceInHeavenAction';
import { SpawnPieceInHellAction } from './SpawnPieceInHellAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class KillPieceAction implements GameAction {
  protected killedPiece: BasePiece;
  protected originBoardId: string | undefined;

  constructor(killedPiece: BasePiece, originBoardId?: string) {
    this.killedPiece = killedPiece;
    this.originBoardId = originBoardId;
  }

  execute(): ActionResult {
    game.increaseDeathCounter();
    destroyPieceOnBoard(this.killedPiece, this.originBoardId);

    if (this.killedPiece.position?.boardId === OVERWORLD_BOARD_ID) {
      const hasPieceKilledOtherPieces = this.killedPiece.killCount > 0;
      const isKilledPieceKing = this.killedPiece instanceof King;
      if (hasPieceKilledOtherPieces || isKilledPieceKing) {
        return new SpawnPieceInHellAction(this.killedPiece).execute();
      } else {
        return new SpawnPieceInHeavenAction(this.killedPiece).execute();
      }
    } else {
      return new PermanentlyKillPieceAction(this.killedPiece).execute();
    }
  }
}
