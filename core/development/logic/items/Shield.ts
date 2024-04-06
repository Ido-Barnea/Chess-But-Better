import { BaseItem } from './abstract/Item';
import { shieldResource } from '../../ui/Resources';
import { Log, MovementLog } from '../../ui/logs/Log';
import { getPieceByPosition } from '../Utilities';
import { spawnItemOnPiece } from '../../LogicAdapter';
import { ItemActionResult } from './types/ItemActionResult';
import { Logger } from '../../ui/logs/Logger';
import { Position } from '../pieces/types/Position';

export class Shield extends BaseItem {
  constructor(position?: Position) {
    super('shield', shieldResource, 3, position);
  }

  use(position: Position): ItemActionResult {
    const piece = getPieceByPosition(position);
    if (!piece || !piece.position) return ItemActionResult.FAILURE;

    const logCoordinates = MovementLog.convertPositionToNotation(
      piece.position.coordinates,
    );
    new Log(`${piece.player.color} ${piece.name} on ${logCoordinates} equiped a ${this.name}.`).addToQueue();
    Logger.logMessages();

    this.position = position;
    piece.health++;

    spawnItemOnPiece(this);
    return ItemActionResult.SUCCESS;
  }
}
