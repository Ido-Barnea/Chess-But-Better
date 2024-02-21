import { Item } from './Items';
import { shieldResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { Log } from '../../ui/logs/Log';
import { getPieceByPosition } from '../Utilities';
import { spawnItemOnPiece } from '../../LogicAdapter';

export class Shield extends Item {
  constructor(position?: Position) {
    super('shield', shieldResource, 3, position);
  }

  use(position: Position): void {
    const piece = getPieceByPosition(position);
    if (!piece) return;

    new Log(
      `${piece.player.color} ${piece.name} placed a ${this.name} on ${piece}.`,
    ).addToQueue();

    this.position = position;
    piece.health++;

    spawnItemOnPiece(this);
  }
}
