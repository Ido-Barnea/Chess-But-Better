import { NOTATIONS_LETTERS, NOTATIONS_NUMBERS } from '../logic/Constants';
import { Piece } from '../logic/pieces/Pieces';
import { Square } from '../logic/pieces/PiecesUtilities';

enum LogColor {
  general = 'log-color-general',
  kill = 'log-color-kill',
  rule = 'log-color-rule',
  movement = 'log-color-movement',
}

export class Logger {
  private static log(message: string, color: LogColor) {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;

    logsContainer.innerHTML += `<p class="${color}";>> ${message}</p>`;
    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }

  static logGeneral(message: string) {
    this.log(message, LogColor.general);
  }

  static logKill(message: string) {
    this.log(message, LogColor.kill);
  }

  static logRule(message: string) {
    this.log(message, LogColor.rule);
  }

  static logMovement(draggedPiece: Piece, targetSquare: Square) {
    const fromNotation = this.convertPositionToNotation(
      draggedPiece.position.coordinates,
    );
    const toNotation = this.convertPositionToNotation(
      targetSquare.position.coordinates,
    );

    const pieceLogo = `${draggedPiece.pieceLogo}`;
    const pieceColor = `${draggedPiece.player.color}`;
    const pieceName = `${draggedPiece.name}`;

    this.log(
      `${pieceLogo} ${pieceColor}  ${pieceName} moved from ${fromNotation} to ${toNotation}.`,
      LogColor.movement,
    );
  }

  private static convertPositionToNotation(position: [number, number]) {
    const x = NOTATIONS_LETTERS[position[0]];
    const y = NOTATIONS_NUMBERS[position[1]];
    return `${x},${y}`;
  }
}
