import { pieces } from "./logic";
import { Piece, Square } from "./pieces";

interface ChessBoardType {
  boardContainer: Element;
  revealButton?: Element;
  boardWidth: number;
  notationsLetters: string[];
  squareidType: string;
  darkSquareColor: string;
  lightSquareColor: string;
}
export class ChessBoard implements ChessBoardType {
  boardContainer: Element;
  boardWidth = 8;
  notationsLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  squareidType: string;
  darkSquareColor: string;
  lightSquareColor: string;
  revealButton?: Element;

  constructor(
    boardContainer: Element,
    squareidType: string,
    darkSquareColor: string,
    lightSquareColor: string,
    includeNotations: Boolean,
    includePieces: Boolean,
    revealButton?: Element,
  ) {
    this.boardContainer = boardContainer;
    this.squareidType = squareidType;
    this.darkSquareColor = darkSquareColor;
    this.lightSquareColor = lightSquareColor;
    this.revealButton = revealButton;
    this.initializeBoard(includeNotations, includePieces);
  }

  initializeBoard(includeNotations: Boolean, includePieces: Boolean) {
    if (includeNotations) {
      const leftBoardContainer = document.createElement("div");
      leftBoardContainer.id = "left-notations-container";

      const bottomBoardContainer = document.createElement("div");
      bottomBoardContainer.id = "bottom-notations-container";

      this.boardContainer.appendChild(leftBoardContainer);
      this.boardContainer.appendChild(bottomBoardContainer);

      for (let column = 0; column < this.boardWidth; column++) {
        this.createNotation((column + 1).toString());
        this.createNotation(
          this.notationsLetters[this.boardWidth - column - 1],
        );
      }
    }

    const boardDisplay = document.createElement("div");
    boardDisplay.id = "board-display";
    this.boardContainer.appendChild(boardDisplay);

    for (let row = 0; row < this.boardWidth; row++) {
      for (let column = 0; column < this.boardWidth; column++) {
        this.createSquare([column, row]);
      }
    }

    if (includePieces) {
      pieces.forEach((piece) => {
        piece.board = "normal";
        const pieceElement = this.createPieceElement(piece);
        const square = document.querySelectorAll(
          `[square-id="${piece.position}"]`,
        )[0];
        square.appendChild(pieceElement);
      });
    }
  }

  createSquare(position: [number, number]) {
    const squareElement = document.createElement("div");
    squareElement.classList.add("square");
    squareElement.setAttribute(this.squareidType, position.join(","));

    const backgroundColor = this.getBackgroundColor(position);
    squareElement.classList.add(backgroundColor);
    const boardDisplay = this.boardContainer.querySelector("#board-display");
    boardDisplay!.appendChild(squareElement);
  }

  createNotation(notation: string) {
    const notationElement = document.createElement("p");
    notationElement.classList.add("notation");
    notationElement.innerHTML = notation;

    if (this.notationsLetters.includes(notation)) {
      notationElement.classList.add("letter");
      const bottomBoardContainer = this.boardContainer.querySelector(
        "#bottom-notations-container",
      );
      bottomBoardContainer!.appendChild(notationElement);
    } else {
      notationElement.classList.add("number");
      const leftBoardContainer = this.boardContainer.querySelector(
        "#left-notations-container",
      );
      leftBoardContainer!.appendChild(notationElement);
    }
  }

  getBackgroundColor(position: [number, number]) {
    const isEvenColumn = position[0] % 2 === 0;
    const isEvenRow = position[1] % 2 === 0;
    return isEvenRow
      ? isEvenColumn
        ? this.lightSquareColor
        : this.darkSquareColor
      : isEvenColumn
      ? this.darkSquareColor
      : this.lightSquareColor;
  }

  createPieceElement(piece: Piece) {
    const pieceElement = document.createElement("div");
    pieceElement.classList.add("piece");
    pieceElement.setAttribute("draggable", "true");
    pieceElement.setAttribute("id", piece.name);

    pieceElement.classList.add(piece.player.color);

    pieceElement.innerHTML = piece.resource;

    return pieceElement;
  }

  movePieceOnBoard(draggedPiece: Piece, targetSquare: Square) {
    const draggedPieceSquareElement = document.querySelector(
      `[${this.squareidType}="${draggedPiece.position.join(",")}"]`,
    ) as HTMLElement;
    const draggedPieceElement =
      draggedPieceSquareElement?.firstElementChild as HTMLElement;

    const targetSquareElement = document.querySelector(
      `[${this.squareidType}="${targetSquare.position.join(",")}"]`,
    ) as HTMLElement;

    targetSquareElement.appendChild(draggedPieceElement);
  }

  destroyPieceOnBoard(targetPiece: Piece) {
    const targetPieceSquareElement = document.querySelector(
      `[${this.squareidType}="${targetPiece.position.join(",")}"]`,
    );
    const targetPieceElement =
      targetPieceSquareElement?.firstElementChild as HTMLElement;

    targetPieceElement.remove();
  }

  highlightSquare(target: HTMLElement, shouldHighlight: boolean) {
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

  spawnPieceOnBoard(piece: Piece) {
    this.revealButton?.classList.remove("hidden");
    this.boardContainer?.classList.remove("hidden");

    const pieceElement = this.createPieceElement(piece);
    const square = document.querySelectorAll(
      `[${this.squareidType}="${piece.position}"]`,
    )[0];
    square.appendChild(pieceElement);
  }
}
