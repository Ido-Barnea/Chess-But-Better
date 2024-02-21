import { NOTATIONS_LETTERS, NOTATIONS_NUMBERS } from '../../Constants';
import { Piece } from '../../logic/pieces/Piece';
import { Position } from '../../logic/pieces/PiecesUtilities';
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
  constructor(draggedPiece: Piece, targetPosition: Position) {
    const { position, pieceIcon, player, name } = draggedPiece;

    const fromNotation = MovementLog.convertPositionToNotation(
      position.coordinates,
    );
    const toNotation = MovementLog.convertPositionToNotation(
      targetPosition.coordinates,
    );

    const message = `${pieceIcon} ${player.color} ${name} moved from ${fromNotation} to ${toNotation}.`;

    super(message, LogColor.MOVEMENT);
  }

  static convertPositionToNotation(position: [number, number]) {
    const x = NOTATIONS_LETTERS[position[0]];
    const y = NOTATIONS_NUMBERS[position[1]];
    return `${x},${y}`;
  }

  addToQueue() {
    Logger.queue.unshift(this);
  }
}

export class KillLog extends Log {
  constructor(killedPiece: Piece, cause: Piece | string) {
    const {
      pieceIcon: killedPieceIcon,
      player: { color: killedPieceColor },
      name: killedPieceName,
    } = killedPiece;

    let message = `${killedPieceIcon} ${killedPieceColor} ${killedPieceName} was killed by `;
    if (cause instanceof Piece) {
      const {
        pieceIcon: killerPieceIcon,
        player: { color: killerPieceColor },
        name: killerPieceName,
      } = cause;

      message += `${killerPieceIcon} ${killerPieceColor} ${killerPieceName}.`;
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
