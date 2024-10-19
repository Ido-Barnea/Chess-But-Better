import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { IDeathsCounter } from '../game-state/counters/deaths-counter/abstract/IDeathsCounter';
import { IEditablePiecesStorage } from '../game-state/storages/pieces-storage/abstract/IEditablePiecesStorage';
import { King } from '../pieces/King';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class PermanentlyKillPieceAction implements GameAction {
  protected killedPiece: BasePiece;
  private piecesStorage: IEditablePiecesStorage;
  private deathsCounter: IDeathsCounter;

  constructor(
    killedPiece: BasePiece,
    piecesStorage: IEditablePiecesStorage,
    deathsCounter: IDeathsCounter,
  ) {
    this.killedPiece = killedPiece;
    this.piecesStorage = piecesStorage;
    this.deathsCounter = deathsCounter;
  }

  execute(): ActionResult {
    this.killedPiece.position = undefined;
    this.piecesStorage.removePiece(this.killedPiece);

    if (this.killedPiece instanceof King) {
      game.end();
    }

    this.deathsCounter.increaseCount();
    return ActionResult.SUCCESS;
  }
}
