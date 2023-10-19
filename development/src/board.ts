import { ChessBoard } from "./chess_board";
import { Piece, Square } from "./pieces";

let overWorld: ChessBoard;
let hell: ChessBoard;
let heaven: ChessBoard;

const boardContainer = document.querySelector("#board-container")!;
const hellboardContainer = document.querySelector("#board-hell-container")!;
const heavenboardContainer = document.querySelector("#board-heaven-container")!;

const hellBtn = document.getElementById("hellbtn")!;
const heavenBtn = document.getElementById("heavenbtn")!;

const squareId = "square-id";
const squareHellId = "square-hell-id";
const squareHeavenId = "square-heaven-id";

const darkSquareColor = "brown-background";
const lightSquareColor = "beige-background";
const darkHellSquareColor = "dark-red-background";
const lightHellSquareColor = "dark-orange-background";
const darkHeavenSquareColor = "blue-background";
const lightHeavenSquareColor = "water-background";

export function initializeBoards() {
  overWorld = new ChessBoard(
    boardContainer,
    squareId,
    darkSquareColor,
    lightSquareColor,
    true,
    true,
  );
  hell = new ChessBoard(
    hellboardContainer,
    squareHellId,
    darkHellSquareColor,
    lightHellSquareColor,
    false,
    false,
    hellBtn,
  );
  heaven = new ChessBoard(
    heavenboardContainer,
    squareHeavenId,
    darkHeavenSquareColor,
    lightHeavenSquareColor,
    false,
    false,
    heavenBtn,
  );
}

export function movePieceOnBoard(draggedPiece: Piece, targetSquare: Square) {
  switch (draggedPiece.board) {
    case "normal":
      overWorld.movePieceOnBoard(draggedPiece, targetSquare);
      break;
    case "hell":
      hell.movePieceOnBoard(draggedPiece, targetSquare);
      break;
    case "heaven":
      heaven.movePieceOnBoard(draggedPiece, targetSquare);
  }
}

export function destroyPieceOnBoard(targetPiece: Piece) {
  switch (targetPiece.board) {
    case "normal":
      overWorld.destroyPieceOnBoard(targetPiece);
      break;
    case "hell":
      hell.destroyPieceOnBoard(targetPiece);
      break;
    case "heaven":
      heaven.destroyPieceOnBoard(targetPiece);
      break;
  }
}

export function spawnPieceOnBoard(piece: Piece) {
  switch (piece.board) {
    case "hell":
      hell.spawnPieceOnBoard(piece);
      break;
    case "heaven":
      heaven.spawnPieceOnBoard(piece);
      break;

    default:
      return;
  }
}

export function highlightSquare(target: HTMLElement, shouldHighlight: boolean) {
  const targetElementParentElement = target.parentElement as HTMLElement;
  if (targetElementParentElement.hasAttribute(squareId)) {
    overWorld.highlightSquare(target, shouldHighlight);
  } else if (targetElementParentElement.hasAttribute(squareHellId)) {
    hell.highlightSquare(target, shouldHighlight);
  } else if (targetElementParentElement.hasAttribute(squareHeavenId)) {
    heaven.highlightSquare(target, shouldHighlight);
  }
}
