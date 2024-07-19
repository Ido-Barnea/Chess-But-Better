import { isEqual } from 'lodash';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { IEditablePiecesStorage } from '../game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { TriggerPieceOnItemAction } from './TriggerPieceOnItemAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';
import { IDeathsCounter } from '../game state/counters/deaths counter/abstract/IDeathsCounter';

export class SpawnPieceAction implements GameAction {
  protected piece: BasePiece;
  protected boardId: string;
  protected piecesStorage: IEditablePiecesStorage;
  protected deathsCounter: IDeathsCounter;

  constructor(
    piece: BasePiece,
    boardId: string,
    piecesStorage: IEditablePiecesStorage,
    deathsCounter: IDeathsCounter,
  ) {
    this.piece = piece;
    this.boardId = boardId;
    this.piecesStorage = piecesStorage;
    this.deathsCounter = deathsCounter;
  }

  execute(): ActionResult {
    if (!this.piece || !this.piece.position) return ActionResult.FAILURE;
    this.piece.modifiers.killCount = 0;
    this.piece.position.boardId = this.boardId;

    this.piecesStorage.getPieces().forEach((piece) => {
      const areOnTheSamePosition = isEqual(this.piece.position, piece.position);
      const areTheSame = piece === this.piece;

      if (areOnTheSamePosition && !areTheSame) {
        new PermanentlyKillPieceAction(piece, this.piecesStorage, this.deathsCounter).execute();
      }
    });

    game.getItems().forEach((item) => {
      if (isEqual(this.piece.position, item.position)) {
        new TriggerPieceOnItemAction(item, this.piece).execute();
      }
    });

    spawnPieceOnBoard(this.piece);
    return ActionResult.SUCCESS;
  }
}
