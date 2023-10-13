import { Piece, Square } from "./pieces";

export class Logger {
  static log(message: string) {
    const logsContainer = document.getElementById("logs-container")!;
    logsContainer.innerHTML += `<p>> ${message}</p>`;

    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the last log
  }

  static logMovement(draggedPiece: Piece, targetSquare: Square) {
    const fromNotation = this.convertPositionToNotation(draggedPiece.position);
    const toNotation = this.convertPositionToNotation(targetSquare.position);
    this.log(
      `${draggedPiece.name} moved from ${fromNotation} to ${toNotation}.`,
    );
  }

  private static convertPositionToNotation(position: [number, number]) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    let x = letters[position[0]];
    let y = numbers[position[1]];
    return `${x},${y}`;
  }
}
