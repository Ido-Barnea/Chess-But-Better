import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { PieceMovedOnPiggyBankActionHandler } from './PieceMovedOnPiggyBankActionHandler';
import { PieceMovedOnTrapActionHandler } from './PieceMovedOnTrapActionHandler';
import { ActionHandler } from './abstract/Handler';

export class PieceMovedOnItemActionHandler implements ActionHandler {
  private _item: BaseItem;
  private _piece: BasePiece;

  constructor (item: BaseItem, piece: BasePiece) {
    this._item = item;
    this._piece = piece;
  }
  
  handle() {
    switch (this._item.name) {
      case 'piggy bank': {
        new PieceMovedOnPiggyBankActionHandler(this._item, this._piece).handle();
        break;
      }
      case 'trap': {
        new PieceMovedOnTrapActionHandler(this._item, this._piece).handle();
        break;
      }
    }
  }
}
