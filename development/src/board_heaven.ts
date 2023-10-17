import { Logger } from "./logger";
import { pieces } from "./logic";
import { Piece, Square } from "./pieces";

const heavenboardContainer = document.querySelector("#board-heaven-container")!;

const boardWidth = 8;
const notationsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function initializeHeavenBoard() {
    const boardDisplay = document.createElement('div');
    boardDisplay.id = "board-display";

    heavenboardContainer.appendChild(boardDisplay);
    
    for (let row = 0; row < boardWidth; row++) {
        for (let column = 0; column < boardWidth; column++) {
            createSquare([column, row]);
        }
    }
}

function createSquare(position: [number, number]) {
    const squareElement = document.createElement("div");
    squareElement.classList.add("square");
    squareElement.setAttribute("square-heaven-id", position.join(","));

    const backgroundColor = getBackgroundColor(position);
    squareElement.classList.add(backgroundColor);
    const boardDisplay = heavenboardContainer.children[0];
    boardDisplay.appendChild(squareElement);
}

function getBackgroundColor(position: [number, number]) {
  const isEvenColumn = position[0] % 2 === 0;
  const isEvenRow = position[1] % 2 === 0;
  return isEvenRow
    ? isEvenColumn
      ? "water-background"
      : "blue-background"
    : isEvenColumn
    ? "blue-background"
    : "water-background";
}

export function spawnHeavenPiece(piece: Piece)
{
    piece.board = "heaven";
    const pieceElement = createPieceElement(piece);
    const square = document.querySelectorAll(
      `[square-heaven-id="${piece.position}"]`,
    )[0];
    square.appendChild(pieceElement);
}

function createPieceElement(piece: Piece) {
  const pieceElement = document.createElement("div");
  pieceElement.classList.add("piece");
  pieceElement.setAttribute("draggable", "true");
  pieceElement.setAttribute("id", piece.name);

  pieceElement.classList.add(piece.player.color);

  pieceElement.innerHTML = piece.resource;

  return pieceElement;
}

export function movePieceOnHeavenBoard(draggedPiece: Piece, targetSquare: Square) {
  const draggedPieceSquareElement = document.querySelector(
    `[square-heaven-id="${draggedPiece.position.join(",")}"]`,
  ) as HTMLElement;
  const draggedPieceElement =
    draggedPieceSquareElement?.firstElementChild as HTMLElement;

  const targetSquareElement = document.querySelector(
    `[square-heaven-id="${targetSquare.position.join(",")}"]`,
  ) as HTMLElement;

  targetSquareElement.appendChild(draggedPieceElement);
}

export function destroyPieceOnHeavenBoard(targetPiece: Piece) {
  const targetPieceSquareElement = document.querySelector(
    `[square-heaven-id="${targetPiece.position.join(",")}"]`,
  );
  const targetPieceElement =
    targetPieceSquareElement?.firstElementChild as HTMLElement;

  targetPieceElement.remove();
}
