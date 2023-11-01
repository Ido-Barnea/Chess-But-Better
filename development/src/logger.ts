import { NOTATIONS_LETTERS, NOTATIONS_NUMBERS } from './board';
import { Piece, Square } from './pieces';

const ColorEnum = {
  DEFAULT: 'gray',
  KILL: 'red',
  RULE: 'purple',
  ITEM: 'green',
};

export class Logger {
  static log(message: string, color: string = ColorEnum.DEFAULT) {
    const logsContainer = document.getElementById('logs-container')!;
    logsContainer.innerHTML += `<p style='color: ${color};'>> ${message}</p>`;

    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }

  static logKill(message: string) {
    this.log(message, ColorEnum.KILL);
  }

  static logRule(message: string) {
    this.log(message, ColorEnum.RULE);
  }

  static logItem(message: string) {
    this.log(message, ColorEnum.ITEM);
  }

  static logMovement(draggedPiece: Piece, targetSquare: Square) {
    const fromNotation = this.convertPositionToNotation(
      draggedPiece.position.coordinates,
    );
    const toNotation = this.convertPositionToNotation(
      targetSquare.position.coordinates,
    );
    this.log(
      `${draggedPiece.player.color} ${draggedPiece.name} moved from ${fromNotation} to ${toNotation}.`,
    );
  }

  private static convertPositionToNotation(position: [number, number]) {
    const x = NOTATIONS_LETTERS[position[0]];
    const y = NOTATIONS_NUMBERS[position[1]];
    return `${x},${y}`;
  }
}
