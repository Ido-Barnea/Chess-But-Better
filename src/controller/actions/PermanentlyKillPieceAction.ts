import { destroyPieceOnBoard } from '../../LogicAdapter';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { IEditablePiecesStorage } from '../game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { King } from '../pieces/King';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class PermanentlyKillPieceAction implements GameAction {
  protected killedPiece: BasePiece;
  protected piecesStorage: IEditablePiecesStorage;

  constructor(killedPiece: BasePiece, piecesStorage: IEditablePiecesStorage) {
    this.killedPiece = killedPiece;
    this.piecesStorage = piecesStorage;
  }

  execute(): ActionResult {
    this.killedPiece.position = undefined;
      this.piecesStorage.removePiece(this.killedPiece);

    if (this.killedPiece instanceof King) {
      game.end();
    }

    game.increaseDeathCounter();
    destroyPieceOnBoard(this.killedPiece);
    return ActionResult.SUCCESS;
  }
}
