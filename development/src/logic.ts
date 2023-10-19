import { Player } from "./players";
import {
  Piece,
  Pawn,
  Bishop,
  Knight,
  Rook,
  Queen,
  King,
  Square,
} from "./pieces";
import { Logger } from "./logger";
import { movePieceOnBoard, destroyPieceOnBoard } from "./board";
import {
  movePieceOnHellBoard,
  destroyPieceOnHellBoard,
  spawnHellPiece,
} from "./board_hell";
import {
  movePieceOnHeavenBoard,
  destroyPieceOnHeavenBoard,
  spawnHeavenPiece,
} from "./board_heaven";
import { activeRules } from "./rules";
import { updatePlayersInformation } from "./game";

const whitePlayer: Player = {
  color: "white",
  xp: 0,
  gold: 0,
};
const blackPlayer: Player = {
  color: "black",
  xp: 0,
  gold: 0,
};
export const players = [whitePlayer, blackPlayer];
export let pieces = [
  new Rook([0, 0], players[1]),
  new Knight([1, 0], players[1]),
  new Bishop([2, 0], players[1]),
  new Queen([3, 0], players[1]),
  new King([4, 0], players[1]),
  new Bishop([5, 0], players[1]),
  new Knight([6, 0], players[1]),
  new Rook([7, 0], players[1]),
  new Pawn([0, 1], players[1]),
  new Pawn([1, 1], players[1]),
  new Pawn([2, 1], players[1]),
  new Pawn([3, 1], players[1]),
  new Pawn([4, 1], players[1]),
  new Pawn([5, 1], players[1]),
  new Pawn([6, 1], players[1]),
  new Pawn([7, 1], players[1]),
  new Pawn([0, 6], players[0]),
  new Pawn([1, 6], players[0]),
  new Pawn([2, 6], players[0]),
  new Pawn([3, 6], players[0]),
  new Pawn([4, 6], players[0]),
  new Pawn([5, 6], players[0]),
  new Pawn([6, 6], players[0]),
  new Pawn([7, 6], players[0]),
  new Rook([0, 7], players[0]),
  new Knight([1, 7], players[0]),
  new Bishop([2, 7], players[0]),
  new Queen([3, 7], players[0]),
  new King([4, 7], players[0]),
  new Bishop([5, 7], players[0]),
  new Knight([6, 7], players[0]),
  new Rook([7, 7], players[0]),
];

let currentPlayerIndex = 0;
let turnCounter = 0;
export let roundCounter = 1;
export let deathCounter = 0;

let isCastling = false;
export let isFriendlyFire = false;
export let isPieceKilled = false;
export let isFirstKill = true;

export let fellOffTheBoardPiece: Piece | undefined;

export function getCurrentPlayer(): Player {
  return players[currentPlayerIndex];
}

export function comparePositions(
  firstPosition: Array<number>,
  secondPosition: Array<number>,
): boolean {
  return (
    firstPosition[0] === secondPosition[0] &&
    firstPosition[1] === secondPosition[1]
  );
}

export function convertSquareIdTypeToBoard(squareidType: string) {
  switch (squareidType) {
    case "square-hell-id":
      return "hell";
    case "square-heaven-id":
      return "heaven";
    default:
      return "normal";
  }
}

export function comparePositionsAndBoards(
  firstPosition: Array<number>,
  secondPosition: Array<number>,
  firstBoard: string,
  secondBoard: string,
): boolean {
  let isPositions =
    firstPosition[0] === secondPosition[0] &&
    firstPosition[1] === secondPosition[1];

  let isBoards = firstBoard === secondBoard;

  return isBoards && isPositions;
}

export function switchIsCastling() {
  isCastling = !isCastling;
}

export function getPieceByPosition(
  position: [number, number],
): Piece | undefined {
  return pieces.find((piece) => comparePositions(position, piece.position));
}

export function getPieceByPositionAndBoard(
  position: [number, number],
  board: string,
): Piece | undefined {
  return pieces.find((piece) =>
    comparePositionsAndBoards(position, piece.position, board, piece.board),
  );
}

function convertSquareIdToPosition(squareId: string): [number, number] {
  return squareId.split(",").map((str) => parseInt(str)) as [number, number];
}

export function onAction(
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
) {
  const draggedElementParentElement =
    draggedElement.parentElement as HTMLElement;
  let squareidType: string;

  if (draggedElementParentElement.hasAttribute("square-id")) {
    squareidType = "square-id";
  } else if (draggedElementParentElement.hasAttribute("square-hell-id")) {
    squareidType = "square-hell-id";
  } else {
    squareidType = "square-heaven-id";
  }

  const draggedElementPosition = convertSquareIdToPosition(
    draggedElementParentElement.getAttribute(squareidType)!,
  );
  const draggedPiece: Piece | undefined = pieces.find((piece) =>
    comparePositionsAndBoards(
      piece.position,
      draggedElementPosition,
      piece.board,
      convertSquareIdTypeToBoard(squareidType),
    ),
  );

  if (targetElement.classList.contains("piece")) {
    const targetPiece: Piece | undefined = pieces.find((piece) => {
      const targetElementPosition = convertSquareIdToPosition(
        targetElement.parentElement?.getAttribute(squareidType)!,
      );
      return comparePositionsAndBoards(
        targetElementPosition,
        piece.position,
        piece.board,
        convertSquareIdTypeToBoard(squareidType),
      );
    });

    actOnTurn(draggedPiece, targetPiece);
  } else {
    let squareBoard: string;
    switch (squareidType) {
      case "square-id":
        squareBoard = "normal";
        break;
      case "square-hell-id":
        squareBoard = "hell";
        break;
      case "square-heaven-id":
        squareBoard = "heaven";
        break;
    }
    const targetSquare: Square = {
      position: convertSquareIdToPosition(
        targetElement.getAttribute(squareidType)!,
      ),
      board: squareBoard!,
    };
    actOnTurn(draggedPiece, targetSquare);
  }
}

export function onFallOffTheBoard(draggedElement: HTMLElement) {
  let squareidType: string = "";

  if (draggedElement.parentElement?.hasAttribute("square-id")) {
    squareidType = "square-id";
  } else if (draggedElement.parentElement?.hasAttribute("square-hell-id")) {
    squareidType = "square-hell-id";
  } else if (draggedElement.parentElement?.hasAttribute("square-heaven-id")) {
    squareidType = "square-heaven-id";
  }

  const draggedPiece: Piece | undefined = pieces.find((piece) => {
    const draggedElementPosition = convertSquareIdToPosition(
      draggedElement.parentElement?.getAttribute(squareidType)!,
    );
    return comparePositionsAndBoards(
      draggedElementPosition,
      piece.position,
      convertSquareIdTypeToBoard(squareidType),
      piece.board,
    );
  });

  if (!draggedPiece) return;
  if (!isAllowedToMove(draggedPiece)) return;

  killPiece(draggedPiece);

  fellOffTheBoardPiece = draggedPiece;

  switch (
    draggedPiece.board //Bug: always trying to destroy on 2 boards instead of just one??
  ) {
    case "normal":
      destroyPieceOnBoard(draggedPiece);
      endTurn();
    case "hell":
      destroyPieceOnHellBoard(draggedPiece);
      endTurn();
    case "heaven":
      destroyPieceOnHeavenBoard(draggedPiece);
      endTurn();
  }
}

function isAllowedToMove(draggedPiece: Piece) {
  return draggedPiece.player === getCurrentPlayer();
}

function actOnTurn(
  draggedPiece: Piece | undefined,
  target: Piece | Square | undefined,
) {
  if (!draggedPiece || !target) return;
  if (!isAllowedToMove(draggedPiece)) return;
  if (!draggedPiece.isValidMove(target)) return;
  if (draggedPiece === target) return;
  if (draggedPiece.board !== target.board) return;

  if ((target as Piece).name !== undefined) {
    const targetPiece = target as Piece;
    actOnTurnPieceToPiece(draggedPiece, targetPiece);
  } else {
    const targetSquare = target as Square;
    actOnTurnPieceToSquare(draggedPiece, targetSquare);
  }
}

function actOnTurnPieceToPiece(draggedPiece: Piece, targetPiece: Piece) {
  isFriendlyFire =
    targetPiece.player === draggedPiece.player &&
    targetPiece.board === draggedPiece.board;
  draggedPiece.hasKilled = true;

  if (targetPiece.board === "normal" && targetPiece.hasKilled) {
    Logger.log(
      `A ${targetPiece.player.color} ${targetPiece.name} 
      was sent to hell by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );
    destroyPieceOnBoard(targetPiece);
    targetPiece.board = "hell";

    //if a piece that dies spawns on another piece, that piece needs to be deleted;
    const duplicatePiece = pieces.find(
      (piece) =>
        comparePositionsAndBoards(
          targetPiece.position,
          piece.position,
          targetPiece.board,
          piece.board,
        ) && piece != targetPiece,
    );
    if (duplicatePiece != undefined) {
      pieces = pieces.filter((piece) => piece !== duplicatePiece);
      destroyPieceOnHellBoard(duplicatePiece);
    }

    spawnHellPiece(targetPiece);
  } else if (targetPiece.board === "normal" && !targetPiece.hasKilled) {
    Logger.log(
      `A ${targetPiece.player.color} ${targetPiece.name} 
        was sent to heaven by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );
    destroyPieceOnBoard(targetPiece);
    targetPiece.board = "heaven";

    //if a piece that dies spawns on another piece, that piece needs to be deleted;
    const duplicatePiece = pieces.find(
      (piece) =>
        comparePositionsAndBoards(
          targetPiece.position,
          piece.position,
          targetPiece.board,
          piece.board,
        ) && piece != targetPiece,
    );
    if (duplicatePiece != undefined) {
      pieces = pieces.filter((piece) => piece !== duplicatePiece);
      destroyPieceOnHeavenBoard(duplicatePiece);
    }

    spawnHeavenPiece(targetPiece);
  } else if (targetPiece.board === "hell") {
    Logger.log(
      `A ${targetPiece.player.color} ${targetPiece.name} was killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );
    killPiece(targetPiece);
  } else if (targetPiece.board === "heaven") {
    Logger.log(
      `A ${targetPiece.player.color} ${targetPiece.name} was killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );
    killPiece(targetPiece);
  }

  const targetSquare: Square = {
    position: targetPiece.position,
    board: draggedPiece.board,
  };
  move(draggedPiece, targetSquare);
}

function actOnTurnPieceToSquare(draggedPiece: Piece, targetSquare: Square) {
  if (draggedPiece.board !== targetSquare.board) return;
  let isValidCastling = true;
  if (isCastling) {
    isValidCastling = castle(draggedPiece, targetSquare);
  }

  if (isValidCastling) {
    move(draggedPiece, targetSquare);
  } else {
    switchIsCastling();
  }
}

function killPiece(targetPiece: Piece) {
  pieces = pieces.filter((piece) => piece !== targetPiece);
  deathCounter++;
  isPieceKilled = true;
  destroyPieceOnBoard(targetPiece);
}

function castle(kingPiece: Piece, targetSquare: Square) {
  const possibleRooks = pieces.filter((piece) => {
    return (
      piece.player === getCurrentPlayer() &&
      !piece.hasMoved &&
      piece.name === "Rook"
    );
  });

  const deltaX = targetSquare.position[0] - kingPiece.position[0];
  // Depends on if it's Kingside or Queenside castling
  const isKingsideCastling = deltaX > 0;
  const rookFilter = (piece: Piece) =>
    isKingsideCastling
      ? piece.position[0] > kingPiece.position[0]
      : piece.position[0] < kingPiece.position[0];
  const rookPiece = possibleRooks.find(rookFilter);
  if (!rookPiece) return false;

  const rookPieceTargetPosition: [number, number] = [
    isKingsideCastling
      ? targetSquare.position[0] - 1
      : targetSquare.position[0] + 1,
    kingPiece.position[1],
  ];
  const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition }; //perhaps buggy because no board provided?
  move(rookPiece, rookPieceTargetSquare);
  Logger.log(`${kingPiece.player.color} castled.`);
  return true;
}

function move(draggedPiece: Piece, targetSquare: Square) {
  if (draggedPiece.board !== targetSquare.board) return;

  Logger.logMovement(draggedPiece, targetSquare);
  if (draggedPiece.board === "normal") {
    movePieceOnBoard(draggedPiece, targetSquare);
  } else if (draggedPiece.board === "hell") {
    movePieceOnHellBoard(draggedPiece, targetSquare);
  } else if (draggedPiece.board === "heaven") {
    movePieceOnHeavenBoard(draggedPiece, targetSquare);
  }
  draggedPiece.position = targetSquare.position;
  draggedPiece.hasMoved = true;

  endTurn();
}

function endTurn() {
  activeRules.forEach((rule) => {
    rule.apply();
  });

  resetVariables();

  currentPlayerIndex =
    currentPlayerIndex + 1 < players.length ? currentPlayerIndex + 1 : 0;
  turnCounter++;

  if (turnCounter % players.length === 0) {
    turnCounter = 0;
    roundCounter++;
  }

  updatePlayersInformation();
}

function resetVariables() {
  isCastling = false;
  isFriendlyFire = false;
  isPieceKilled = false;
  fellOffTheBoardPiece = undefined;
}
