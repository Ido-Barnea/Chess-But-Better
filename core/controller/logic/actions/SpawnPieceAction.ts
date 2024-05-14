import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { game } from '../../Game';
import { spawnPieceOnBoard } from '../../LogicAdapter';
import { comparePositions } from '../Utilities';
import { PermanentlyKillPieceAction } from './PermanentlyKillPieceAction';
import { TriggerPieceOnItemAction } from './TriggerPieceOnItemAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class SpawnPieceAction implements GameAction {
  protected piece: BasePiece;
  protected boardId: string;

  constructor(piece: BasePiece, boardId: string) {
    this.piece = piece;
    this.boardId = boardId;
  }

  execute(): ActionResult {
    if (!this.piece || !this.piece.position) return ActionResult.FAILURE;
    this.piece.modifiers.killCount = 0;
    this.piece.position.boardId = this.boardId;

    game.getPieces().forEach((piece) => {
      const areOnTheSamePosition = comparePositions(
        this.piece.position,
        piece.position,
      );
      const areTheSame = piece === this.piece;

      if (areOnTheSamePosition && !areTheSame) {
        new PermanentlyKillPieceAction(piece).execute();
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
