import { pieces } from "./logic";
import { Piece, Square } from "./pieces";

const boardContainer = document.querySelector("#board-container")!;

const boardWidth = 8;
const notationsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function initializeBoard() {
  const leftBoardContainer = document.createElement('div');
    leftBoardContainer.id = "left-notations-container";

    const bottomBoardContainer = document.createElement('div');
    bottomBoardContainer.id = "bottom-notations-container";

    const boardDisplay = document.createElement('div');
    boardDisplay.id = "board-display";

    boardContainer.appendChild(leftBoardContainer);
    boardContainer.appendChild(bottomBoardContainer);
    boardContainer.appendChild(boardDisplay);

  for (let row = 0; row < boardWidth; row++) {
    for (let column = 0; column < boardWidth; column++) {
      createSquare([column, row]);
    }
  }

  for (let column = 0; column < boardWidth; column++) {
    createNotation((column + 1).toString());
    createNotation(notationsLetters[boardWidth - column - 1]);
  }

  pieces.forEach((piece) => {
    piece.board = "normal";
    const pieceElement = createPieceElement(piece);
    const square = document.querySelectorAll(
      `[square-id="${piece.position}"]`,
    )[0];
    square.appendChild(pieceElement);
  });
}

function createSquare(position: [number, number]) {
  const squareElement = document.createElement("div");
  squareElement.classList.add("square");
  squareElement.setAttribute("square-id", position.join(","));

  const backgroundColor = getBackgroundColor(position);
  squareElement.classList.add(backgroundColor);
  const boardDisplay = boardContainer.children[2];
  boardDisplay.appendChild(squareElement);
}

function createNotation(notation: string) {
  const notationElement = document.createElement("p");
  notationElement.classList.add("notation");
  notationElement.innerHTML = notation;

  if (notationsLetters.includes(notation)) {
    notationElement.classList.add("letter");
    const bottomBoardContainer = boardContainer.children[1];
    bottomBoardContainer.appendChild(notationElement);
  } else {
    notationElement.classList.add("number");
    const leftBoardContainer = boardContainer.children[0];
    leftBoardContainer.appendChild(notationElement);
  }
}

function getBackgroundColor(position: [number, number]) {
  const isEvenColumn = position[0] % 2 === 0;
  const isEvenRow = position[1] % 2 === 0;
  return isEvenRow
    ? isEvenColumn
      ? "beige-background"
      : "brown-background"
    : isEvenColumn
    ? "brown-background"
    : "beige-background";
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

export function movePieceOnBoard(draggedPiece: Piece, targetSquare: Square) {
  const draggedPieceSquareElement = document.querySelector(
    `[square-id="${draggedPiece.position.join(",")}"]`,
  ) as HTMLElement;
  const draggedPieceElement =
    draggedPieceSquareElement?.firstElementChild as HTMLElement;

  const targetSquareElement = document.querySelector(
    `[square-id="${targetSquare.position.join(",")}"]`,
  ) as HTMLElement;

  targetSquareElement.appendChild(draggedPieceElement);
}

export function destroyPieceOnBoard(targetPiece: Piece) {
  const targetPieceSquareElement = document.querySelector(
    `[square-id="${targetPiece.position.join(",")}"]`,
  );
  const targetPieceElement =
    targetPieceSquareElement?.firstElementChild as HTMLElement;

  targetPieceElement.remove();
}

export function highlightSquare(target: HTMLElement, shouldHighlight: boolean) {
  const targetParentElement = target.parentNode as HTMLElement;
  while (!target.classList.contains("square")) {
    target = target.parentNode as HTMLElement;
  }
  if (target.classList.contains("square")) {
    if (shouldHighlight) {
      target.classList.add("light-gray-background");
    } else {
      target.classList.remove("light-gray-background");
    }
  }
}
