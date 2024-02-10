import { Item } from './Items';
import { Piece } from '../pieces/Piece';
import { Logger } from '../../ui/Logger';
import { shieldResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { game } from '../../Game';

export class Shield extends Item {
  constructor(position?: Position) {
    super('shield', shieldResource, 3, position);
  }

  use(piece: Piece): void {
    Logger.logGeneral(`
      ${piece.player.color} ${piece.name} placed a ${this.name} on ${piece}.
    `);

    piece.equipedItem = this;
    const updatedItems = game.getItems().filter(item => item !== this);
    game.setItems(updatedItems);
  }
}