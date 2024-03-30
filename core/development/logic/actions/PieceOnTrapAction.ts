import { game } from '../../Game';
import { destroyItemOnBoard } from '../../LogicAdapter';
import { killPieceByGame, move } from '../PieceLogic';
import { BaseItem } from '../items/abstract/Item';
import { BasePiece } from '../pieces/abstract/BasePiece';
import { Action } from './abstract/Action';

export class PieceOnTrapAction implements Action {
  private _item: BaseItem;
  private _piece: BasePiece;

  constructor(item: BaseItem, piece: BasePiece) {
    this._item = item;
    this._piece = piece;
  }

  execute() {
    if (!this._item.position) return;

    move(this._piece, this._item.position, false);
    this._piece.health = 1;
    killPieceByGame(this._piece, this._item.name);

    game.setItems(game.getItems().filter((item) => item !== this._item));
    destroyItemOnBoard(this._item);

    game.endMove(false);
  }
}
