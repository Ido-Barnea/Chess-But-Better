import { game } from '../../Game';
import { destroyItemOnBoard } from '../../LogicAdapter';
import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { ActionHandler } from './abstract/Handler';

export class PieceMovedOnPiggyBankActionHandler implements ActionHandler {
  private _item: BaseItem;
  private _piece: BasePiece;

  constructor (item: BaseItem, piece: BasePiece) {
    this._item = item;
    this._piece = piece;
  }
  
  handle() {
    if (!this._piece.position) return;
    game.setItems(game.getItems().filter((item) => item !== this._item));
    destroyItemOnBoard(this._item);
    this._item.use(this._piece.position);
  }
}
