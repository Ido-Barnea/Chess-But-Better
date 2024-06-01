import { BasePiece } from '../../../model/pieces/abstract/BasePiece';
import { Position } from '../../../model/types/Position';
import {
  HELL_BOARD_ID,
  NOTATIONS_LETTERS,
  NOTATIONS_NUMBERS,
} from '../../Constants';
import { Logger } from './Logger';

export enum LogColor {
  GENERAL = 'log-color-general',
  KILL = 'log-color-kill',
  RULE = 'log-color-rule',
  MOVEMENT = 'log-color-movement',
}

export class Log {
  message: string;
  color: LogColor;

  constructor(message: string, color = LogColor.GENERAL) {
    this.message = message;
    this.color = color;
  }

  addToQueue() {
    Logger.queue.push(this);
  }
}

export class MovementLog extends Log {
  constructor(draggedPiece: BasePiece, targetPosition: Position) {
    const { resource, player, position } = draggedPiece;

    const fromNotation = MovementLog.convertPositionToNotation(
      position?.coordinates,
    );
    const toNotation = MovementLog.convertPositionToNotation(
      targetPosition.coordinates,
    );

    const message = `${resource.pieceIcon} ${player.color} ${resource.name} moved from ${fromNotation} to ${toNotation}.`;

    super(message, LogColor.MOVEMENT);
  }

  static convertPositionToNotation(position: [number, number] | undefined) {
    if (!position) return '';

    const x = NOTATIONS_LETTERS[position[0]];
    const y = NOTATIONS_NUMBERS[position[1]];
    return `${x},${y}`;
  }

  addToQueue() {
    Logger.queue.unshift(this);
  }
}

export class KillLog extends Log {
  constructor(killedPiece: BasePiece, cause: BasePiece | string) {
    const { resource, player } = killedPiece;

    let message = `${resource.pieceIcon} ${player.color} ${resource.name} was `;

    if (!killedPiece.position) {
      message += 'permanently killed by ';
    } else {
      const spawnedInBoard =
        killedPiece.position?.boardId === HELL_BOARD_ID ? 'Hell' : 'Heaven';
      message += `sent to ${spawnedInBoard} by `;
    }

    if (cause instanceof BasePiece) {
      const { resource, player } = cause;

      message += `${resource.pieceIcon} ${player.color} ${resource.name}.`;
    } else {
      message += ` ${cause}.`;
    }

    super(message, LogColor.KILL);
  }
}

export class RuleLog extends Log {
  constructor(message: string) {
    super(message, LogColor.RULE);
  }
}
