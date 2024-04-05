import { game } from '../../Game';
import { destroyItemOnBoard } from '../../LogicAdapter';
import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class TriggerPieceOnPiggyBankAction implements GameAction {
  private item: BaseItem;
  private piece: BasePiece;

  constructor(item: BaseItem, piece: BasePiece) {
    this.item = item;
    this.piece = piece;
  }

  execute(): ActionResult {
    if (!this.piece.position) return ActionResult.FAILURE;

    game.setItems(game.getItems().filter((item) => item !== this.item));
    destroyItemOnBoard(this.item);
    this.item.use(this.piece.position);

    return ActionResult.SUCCESS;
  }
}
