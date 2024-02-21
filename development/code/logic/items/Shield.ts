import { Item } from './Items';
import { shieldResource } from '../../ui/Resources';
import { Position } from '../pieces/PiecesUtilities';
import { Log, MovementLog } from '../../ui/logs/Log';
import { getPieceByPosition } from '../Utilities';
import { spawnItemOnPiece } from '../../LogicAdapter';
import { Logger } from '../../ui/logs/Logger';

export class Shield extends Item {
  constructor(position?: Position) {
    super('shield', shieldResource, 3, position);
  }

  use(position: Position): void {
    const piece = getPieceByPosition(position);
    if (!piece) return;

    const logCoordinates = MovementLog.convertPositionToNotation(
      piece.position.coordinates,
    );
    new Log(
      `${piece.player.color} ${piece.name} on ${logCoordinates} equiped a ${this.name}.`,
    ).addToQueue();
    Logger.logMessages();

    this.position = position;
    piece.health++;

    spawnItemOnPiece(this);
  }
}
