import { Item } from './Items';
import { Piece } from '../pieces/Piece';
import { shieldResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { game } from '../../Game';
import { Log } from '../../ui/logger/Log';

export class Shield extends Item {
  constructor(position?: Position) {
    super('shield', shieldResource, 3, position);
  }

  use(piece: Piece): void {
    new Log(`${piece.player.color} ${piece.name} placed a ${this.name} on ${piece}.`).addToQueue();

    piece.equipedItem = this;
    const updatedItems = game.getItems().filter(item => item !== this);
    game.setItems(updatedItems);
  }
}
