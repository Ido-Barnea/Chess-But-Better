import { game } from '../../Game';
import { destroyItemOnBoard } from '../../LogicAdapter';
import { move } from '../PieceLogic';
import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { KillPieceByEnvironmentAction as KillPieceByEnvironmentAction } from './KillPieceByEnvironmentAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class TriggerPieceOnTrapAction implements GameAction {
  private item: BaseItem;
  private piece: BasePiece;

  constructor(item: BaseItem, piece: BasePiece) {
    this.item = item;
    this.piece = piece;
  }

  execute(): ActionResult {
    if (!this.item.position) return ActionResult.FAILURE;

    move(this.piece, this.item.position, false);
    this.piece.health = 1;
    new KillPieceByEnvironmentAction(this.piece, this.item.name).execute();

    game.setItems(game.getItems().filter((item) => item !== this.item));
    destroyItemOnBoard(this.item);

    game.endMove(false);
    return ActionResult.SUCCESS;
  }
}
