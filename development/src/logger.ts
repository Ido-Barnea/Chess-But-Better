import { NOTATIONS_LETTERS, NOTATIONS_NUMBERS } from './board';
import { Piece, Square } from './pieces';

export class Logger {
  static log(message: string) {
    const logsContainer = document.getElementById('logs-container')!;
    logsContainer.innerHTML += `<p>> ${message}</p>`;

    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }

  static logMovement(draggedPiece: Piece, targetSquare: Square) {
    const fromNotation = this.convertPositionToNotation(draggedPiece.position.coordinates);
    const toNotation = this.convertPositionToNotation(targetSquare.position.coordinates);
    this.log(`${draggedPiece.player.color} ${draggedPiece.name} moved from ${fromNotation} to ${toNotation}.`);
  }

  private static convertPositionToNotation(position: [number, number]) {
    const x = NOTATIONS_LETTERS[position[0]];
    const y = NOTATIONS_NUMBERS[position[1]];
    return `${x},${y}`;
  }
}
