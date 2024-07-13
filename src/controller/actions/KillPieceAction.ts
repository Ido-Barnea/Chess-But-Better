import { game } from '../../Game';
import { destroyPieceOnBoard } from '../../LogicAdapter';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { King } from '../pieces/King';
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
    if (this.killedPiece.position?.boardId === OVERWORLD_BOARD_ID) {
      game.increaseDeathCounter();

      const hasPieceKilledOtherPieces =
        this.killedPiece.modifiers.killCount > 0;
      const isKilledPieceKing = this.killedPiece instanceof King;

      const pieceOriginBoardId = this.killedPiece.position.boardId;
      let spawnActionResult = ActionResult.FAILURE;
      if (hasPieceKilledOtherPieces || isKilledPieceKing) {
        spawnActionResult = new SpawnPieceInHellAction(
          this.killedPiece,
        ).execute();
      } else {
        spawnActionResult = new SpawnPieceInHeavenAction(
          this.killedPiece,
        ).execute();
      }

      destroyPieceOnBoard(this.killedPiece, pieceOriginBoardId);
      return spawnActionResult;
    } else {
      destroyPieceOnBoard(this.killedPiece);
      return new PermanentlyKillPieceAction(this.killedPiece).execute();
    }
  }
}
