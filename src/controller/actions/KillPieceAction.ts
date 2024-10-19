import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { OVERWORLD_BOARD_ID } from '../Constants';
import { IDeathsCounter } from '../game-state/counters/deaths-counter/abstract/IDeathsCounter';
import { IEditablePiecesStorage } from '../game-state/storages/pieces-storage/abstract/IEditablePiecesStorage';
import { King } from '../pieces/King';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { SpawnPieceInHeavenAction } from './SpawnPieceInHeavenAction';
import { SpawnPieceInHellAction } from './SpawnPieceInHellAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class KillPieceAction implements GameAction {
  private piecesStorage: IEditablePiecesStorage;
  private deathsCounter: IDeathsCounter;
  protected killedPiece: BasePiece;
  protected originBoardId: string | undefined;

  constructor(
    piecesStorage: IEditablePiecesStorage,
    deathsCounter: IDeathsCounter,
    killedPiece: BasePiece,
    originBoardId?: string,
  ) {
    this.piecesStorage = piecesStorage;
    this.deathsCounter = deathsCounter;
    this.killedPiece = killedPiece;
    this.originBoardId = originBoardId;
  }

  execute(): ActionResult {
    if (this.killedPiece.position?.boardId === OVERWORLD_BOARD_ID) {
      this.deathsCounter.increaseCount();

      const hasPieceKilledOtherPieces = this.killedPiece.modifiers.killCount > 0;
      const isKilledPieceKing = this.killedPiece instanceof King;

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

      return spawnActionResult;
    } else {
      return new PermanentlyKillPieceAction(this.killedPiece, this.piecesStorage, this.deathsCounter).execute();
    }
  }
}
