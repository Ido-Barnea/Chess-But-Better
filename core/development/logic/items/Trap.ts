import { BaseItem } from './abstract/Item';
import { trapResource } from '../../ui/Resources';
import { spawnItemOnBoard } from '../../LogicAdapter';
import { game } from '../../Game';
import { Log, MovementLog } from '../../ui/logs/Log';
import { Logger } from '../../ui/logs/Logger';
import { ItemActionResult } from './types/ItemActionResult';
import { Position } from '../pieces/types/Position';

export class Trap extends BaseItem {
  constructor(position?: Position) {
    super('trap', trapResource, 3, position);
  }

  use(position: Position): ItemActionResult {
    const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();

    const logCoordinates = MovementLog.convertPositionToNotation(
      position.coordinates,
    );

    new Log(
      `${currentPlayer.color} placed a ${this.name} on ${logCoordinates}.`,
    ).addToQueue();
    Logger.logMessages();

    this.position = position;
    game.getItems().push(this);

    spawnItemOnBoard(this);
    return ItemActionResult.SUCCESS;
  }
}
