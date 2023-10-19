import { Logger } from "./logger";
import { pieces } from "./logic";
import { Piece, Square } from "./pieces";

const hellboardContainer = document.querySelector("#board-hell-container")!;

const boardWidth = 8;
const notationsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

const hellBtn = document.getElementById("hellbtn");

export function initializeHellBoard() {
  const boardDisplay = document.createElement("div");
  boardDisplay.id = "board-display";
  hellboardContainer.appendChild(boardDisplay);

  for (let row = 0; row < boardWidth; row++) {
    for (let column = 0; column < boardWidth; column++) {
      createSquare([column, row]);
    }
  }
}

function createSquare(position: [number, number]) {
  const squareElement = document.createElement("div");
  squareElement.classList.add("square");
  squareElement.setAttribute("square-hell-id", position.join(","));

  const backgroundColor = getBackgroundColor(position);
  squareElement.classList.add(backgroundColor);
  const boardDisplay = hellboardContainer.children[0];
  boardDisplay.appendChild(squareElement);
}

function getBackgroundColor(position: [number, number]) {
  const isEvenColumn = position[0] % 2 === 0;
  const isEvenRow = position[1] % 2 === 0;
  return isEvenRow
    ? isEvenColumn
      ? "dark-orange-background"
      : "dark-red-background"
    : isEvenColumn
    ? "dark-red-background"
    : "dark-orange-background";
}

export function spawnHellPiece(piece: Piece) {
  hellBtn!.classList.remove("hidden");
  hellboardContainer.classList.remove("hidden");

  const pieceElement = createPieceElement(piece);
  const square = document.querySelectorAll(
    `[square-hell-id="${piece.position}"]`,
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

export function movePieceOnHellBoard(
  draggedPiece: Piece,
  targetSquare: Square,
) {
  const draggedPieceSquareElement = document.querySelector(
    `[square-hell-id="${draggedPiece.position.join(",")}"]`,
  ) as HTMLElement;
  const draggedPieceElement =
    draggedPieceSquareElement?.firstElementChild as HTMLElement;

  const targetSquareElement = document.querySelector(
    `[square-hell-id="${targetSquare.position.join(",")}"]`,
  ) as HTMLElement;

  targetSquareElement.appendChild(draggedPieceElement);
}

export function destroyPieceOnHellBoard(targetPiece: Piece) {
  const targetPieceSquareElement = document.querySelector(
    `[square-hell-id="${targetPiece.position.join(",")}"]`,
  );
  const targetPieceElement =
    targetPieceSquareElement?.firstElementChild as HTMLElement;

  targetPieceElement.remove();
}
