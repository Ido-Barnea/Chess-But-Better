import { NOTATIONS_LETTERS, NOTATIONS_NUMBERS } from "./board";
import { Piece, Square } from "./pieces";

const defaultColor = "gray";
const killColor = "red";
const ruleColor = "purple";
const itemColor = "green";

export class Logger {
  static log(message: string, color?: string) {
    if (!color || color == "") color = defaultColor;

    const logsContainer = document.getElementById("logs-container")!;
    logsContainer.innerHTML += `<p style="color: ${color};">> ${message}</p>`;

    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }

  static logKill(message: string) {
    this.log(message, killColor);
  }

  static logRule(message: string) {
    this.log(message, ruleColor);
  }

  static logItem(message: string) {
    this.log(message, itemColor);
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
