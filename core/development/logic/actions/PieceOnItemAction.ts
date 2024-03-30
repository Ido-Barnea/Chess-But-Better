import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { PieceOnPiggyBankAction } from './PieceOnPiggyBankAction';
import { PieceOnTrapAction } from './PieceOnTrapAction';
import { Action } from './abstract/Action';

export class PieceOnItemAction implements Action {
  private _item: BaseItem;
  private _piece: BasePiece;

  constructor(item: BaseItem, piece: BasePiece) {
    this._item = item;
    this._piece = piece;
  }

  execute() {
    switch (this._item.name) {
      case 'piggy bank': {
        new PieceOnPiggyBankAction(this._item, this._piece).execute();
        break;
      }
      case 'trap': {
        new PieceOnTrapAction(this._item, this._piece).execute();
        break;
      }
    }
  }
}
