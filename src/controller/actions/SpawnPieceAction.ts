import { game } from '../../Game';
import { spawnPieceOnBoard } from '../../LogicAdapter';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { comparePositions } from '../Utilities';
import { IEditablePiecesStorage } from '../game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { TriggerPieceOnItemAction } from './TriggerPieceOnItemAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class SpawnPieceAction implements GameAction {
  protected piece: BasePiece;
  protected boardId: string;
  protected piecesStorage: IEditablePiecesStorage;

  constructor(piece: BasePiece, boardId: string, piecesStorage: IEditablePiecesStorage) {
    this.piece = piece;
    this.boardId = boardId;
    this.piecesStorage = piecesStorage;
  }

  execute(): ActionResult {
    if (!this.piece || !this.piece.position) return ActionResult.FAILURE;
    this.piece.modifiers.killCount = 0;
    this.piece.position.boardId = this.boardId;

    this.piecesStorage.getPieces().forEach((piece) => {
      const areOnTheSamePosition = comparePositions(
        this.piece.position,
        piece.position,
      );
      const areTheSame = piece === this.piece;

      if (areOnTheSamePosition && !areTheSame) {
        new PermanentlyKillPieceAction(piece, this.piecesStorage).execute();
      }
    });

    game.getItems().forEach((item) => {
      if (comparePositions(this.piece.position, item.position)) {
        new TriggerPieceOnItemAction(item, this.piece).execute();
      }
    });

    spawnPieceOnBoard(this.piece);
    return ActionResult.SUCCESS;
  }
}
