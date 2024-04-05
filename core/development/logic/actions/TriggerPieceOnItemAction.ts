import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { TriggerPieceOnPiggyBankAction } from './TriggerPieceOnPiggyBankAction';
import { TriggerPieceOnTrapAction } from './TriggerPieceOnTrapAction';
import { GameAction } from './abstract/GameAction';
import { ActionResult } from './types/ActionResult';

export class TriggerPieceOnItemAction implements GameAction {
  private item: BaseItem;
  private piece: BasePiece;

  constructor(item: BaseItem, piece: BasePiece) {
    this.item = item;
    this.piece = piece;
  }

  execute(): ActionResult {
    switch (this.item.name) {
      case 'piggy bank': {
        return new TriggerPieceOnPiggyBankAction(this.item, this.piece).execute();
      }
      case 'trap': {
        return new TriggerPieceOnTrapAction(this.item, this.piece).execute();
      }
      default: {
        return ActionResult.FAILURE;
      }
    }
  }
}
