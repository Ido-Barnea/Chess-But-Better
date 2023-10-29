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
  Position,
} from "./pieces";
import { Logger } from "./logger";
import {
  movePieceOnBoard,
  destroyPieceOnBoard,
  spawnPieceOnBoard,
  OVERWORLD_BOARD_ID,
  HELL_BOARD_ID,
  HEAVEN_BOARD_ID,
  destroyItemOnBoard,
} from "./boards";
import { activeRules } from "./rules";
import { updatePlayersInformation } from "./game";
import { Item } from "./items";

export enum PlayerColors {
  WHITE = "White",
  BLACK = "Black",
}

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);
export const players = [whitePlayer, blackPlayer];
export let pieces = [
  new Rook({ coordinates: [0, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Knight({ coordinates: [1, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Bishop({ coordinates: [2, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Queen({ coordinates: [3, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new King({ coordinates: [4, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Bishop({ coordinates: [5, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Knight({ coordinates: [6, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Rook({ coordinates: [7, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [0, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [1, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [2, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [3, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [4, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [5, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [6, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [7, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ coordinates: [0, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [1, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [2, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [3, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [4, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [5, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [6, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ coordinates: [7, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Rook({ coordinates: [0, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Knight({ coordinates: [1, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Bishop({ coordinates: [2, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Queen({ coordinates: [3, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new King({ coordinates: [4, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Bishop({ coordinates: [5, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Knight({ coordinates: [6, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Rook({ coordinates: [7, 7], board: OVERWORLD_BOARD_ID }, players[0]),
];

export let items: Array<Item> = [];

let currentPlayerIndex = 0;
let turnCounter = 0;
export let roundCounter = 1;
export let deathCounter = 0;

let isCastling = false;
export let isFriendlyFire = false;
export let isPieceKilled = false;

export let fellOffTheBoardPiece: Piece | undefined;

export function getCurrentPlayer(): Player {
  return players[currentPlayerIndex];
}

export function comparePositions(
  firstPosition: Position,
  secondPosition: Position,
): boolean {
  const arePositionsEqual =
    firstPosition.coordinates[0] === secondPosition.coordinates[0] &&
    firstPosition.coordinates[1] === secondPosition.coordinates[1];
  const areBoardsEqual = firstPosition.board === secondPosition.board;

  return areBoardsEqual && arePositionsEqual;
}

export function switchIsCastling() {
  isCastling = !isCastling;
}

export function getPieceByPosition(position: Position): Piece | undefined {
  return pieces.find((piece) => comparePositions(position, piece.position));
}

export function getPieceByPositionAndBoard(
  position: Position,
): Piece | undefined {
  return pieces.find((piece) => {
    return comparePositions(position, piece.position);
  });
}

function convertSquareIdToPosition(squareId: string): [number, number] {
  return squareId.split(",").map((str) => parseInt(str)) as [number, number];
}

export function onAction(
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  board: string,
) {
  const draggedElementParentElement =
    draggedElement.parentElement as HTMLElement;

  const draggedElementPosition: Position = {
    coordinates: convertSquareIdToPosition(
      draggedElementParentElement.getAttribute("square-id")!,
    ),
    board: board,
  };

  const draggedPiece: Piece | undefined = pieces.find((piece) =>
    comparePositions(piece.position, draggedElementPosition),
  );

  if (targetElement.classList.contains("piece")) {
    const squareElement = targetElement.parentElement!;
    const targetElementPosition: Position = {
      coordinates: convertSquareIdToPosition(
        squareElement.getAttribute("square-id")!,
      ),
      board: board,
    };

    const targetPiece: Piece | undefined = pieces.find((piece) => {
      return comparePositions(targetElementPosition, piece.position);
    });

    actOnTurn(draggedPiece, targetPiece);
  } else if (targetElement.classList.contains("item")) {
    let squareElement = targetElement as HTMLElement;
    while (!squareElement.getAttribute("square-id")) {
      squareElement = squareElement.parentElement as HTMLElement;
    }

    const itemPosition: Position = {
      coordinates: convertSquareIdToPosition(
        squareElement.getAttribute("square-id")!,
      ),
      board: board,
    };

    items.forEach((item) => {
      if (comparePositions(item.position, itemPosition)) {
        actOnTurn(draggedPiece, item);
      }
    });
  } else {
    const targetSquare: Square = {
      position: {
        coordinates: convertSquareIdToPosition(
          targetElement.getAttribute("square-id")!,
        ),
        board: board,
      },
    };
    actOnTurn(draggedPiece, targetSquare);
  }
}

export function onFallOffTheBoard(draggedElement: HTMLElement, board: string) {
  const draggedPiece: Piece | undefined = pieces.find((piece) => {
    const squareElement = draggedElement.parentElement!;
    const draggedElementPosition: Position = {
      coordinates: convertSquareIdToPosition(
        squareElement.getAttribute("square-id")!,
      ),
      board: board,
    };

    return comparePositions(draggedElementPosition, piece.position);
  });

  if (!draggedPiece) return;
  if (!isAllowedToMove(draggedPiece)) return;

  killPiece(draggedPiece);
  fellOffTheBoardPiece = draggedPiece;

  endTurn();
}

function isAllowedToMove(draggedPiece: Piece) {
  return draggedPiece.player === getCurrentPlayer();
}

function actOnTurn(
  draggedPiece: Piece | undefined,
  target: Piece | Square | Item | undefined,
) {
  if (!draggedPiece || !target) return;
  if (!isAllowedToMove(draggedPiece)) return;
  if (draggedPiece === target) return;
  if (draggedPiece.position.board !== target.position.board) return;

  const targetPosition = draggedPiece.validateMove(target);
  if (
    !comparePositions(targetPosition, target.position) ||
    target instanceof Item
  ) {
    if (!comparePositions(targetPosition, draggedPiece.position)) {
      actOnTurnPieceToTrap(draggedPiece, target as Item);
    }

    return;
  }

  if (target instanceof Piece) {
    const targetPiece = target as Piece;
    actOnTurnPieceToPiece(draggedPiece, targetPiece);
  } else {
    const targetSquare = target as Square;
    actOnTurnPieceToSquare(draggedPiece, targetSquare);
  }
}

function actOnTurnPieceToPiece(draggedPiece: Piece, targetPiece: Piece) {
  isFriendlyFire = targetPiece.player === draggedPiece.player;
  draggedPiece.hasKilled = true;

  deathCounter++;
  isPieceKilled = true;
  destroyPieceOnBoard(targetPiece);

  if (targetPiece.position.board === OVERWORLD_BOARD_ID) {
    Logger.logKill(
      `A ${targetPiece.player.color} ${targetPiece.name} was killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );

    if (targetPiece.hasKilled) {
      targetPiece.position = {
        coordinates: targetPiece.position.coordinates,
        board: HELL_BOARD_ID,
      };
    } else {
      targetPiece.position = {
        coordinates: targetPiece.position.coordinates,
        board: HEAVEN_BOARD_ID,
      };
    }

    // If a piece dies and spawns on another piece, the other piece dies permanently.
    pieces.forEach((piece) => {
      const areOnTheSamePosition = comparePositions(
        targetPiece.position,
        piece.position,
      );
      const areTheSame = piece === targetPiece;

      if (areOnTheSamePosition && !areTheSame) {
        killPiece(piece);
      }
    });

    spawnPieceOnBoard(targetPiece);
  } else {
    Logger.logKill(
      `A ${targetPiece.player.color} ${targetPiece.name} was permanently killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`,
    );
    killPiece(targetPiece);
  }

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare);
}

function actOnTurnPieceToSquare(draggedPiece: Piece, targetSquare: Square) {
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

function actOnTurnPieceToTrap(draggedPiece: Piece, targetItem: Item) {
  killPiece(draggedPiece);
  items = items.filter((item) => item !== targetItem);
  destroyItemOnBoard(targetItem);

  if (draggedPiece.position.board === OVERWORLD_BOARD_ID) {
    draggedPiece.position = { ...targetItem.position };
    draggedPiece.position.board = draggedPiece.hasKilled
      ? HELL_BOARD_ID
      : HEAVEN_BOARD_ID;
    spawnPieceOnBoard(draggedPiece);
  }

  endTurn();
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

  const deltaX =
    targetSquare.position.coordinates[0] - kingPiece.position.coordinates[0];
  // Depends on if it's Kingside or Queenside castling
  const isKingsideCastling = deltaX > 0;
  const rookFilter = (piece: Piece) => {
    const isValidCastling = isKingsideCastling
      ? piece.position.coordinates[0] > kingPiece.position.coordinates[0]
      : piece.position.coordinates[0] < kingPiece.position.coordinates[0];
    const areOnTheSameBoard = piece.position.board === kingPiece.position.board;
    return isValidCastling && areOnTheSameBoard;
  };
  const rookPiece = possibleRooks.find(rookFilter);
  if (!rookPiece) return false;

  const rookPieceTargetPosition: Position = {
    coordinates: [
      isKingsideCastling
        ? targetSquare.position.coordinates[0] - 1
        : targetSquare.position.coordinates[0] + 1,
      kingPiece.position.coordinates[1],
    ],
    board: rookPiece.position.board,
  };

  const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition };
  move(rookPiece, rookPieceTargetSquare, false);
  Logger.log(`${kingPiece.player.color} castled.`);
  return true;
}

function move(draggedPiece: Piece, targetSquare: Square, shouldEndTurn = true) {
  Logger.logMovement(draggedPiece, targetSquare);

  movePieceOnBoard(draggedPiece, targetSquare);

  draggedPiece.position = {
    ...targetSquare.position,
    board: draggedPiece.position.board,
  };
  draggedPiece.hasMoved = true;

  if (shouldEndTurn) endTurn();
}

function endTurn() {
  activeRules.forEach((rule) => {
    rule.apply();
  });

  resetVariables();

  currentPlayerIndex =
    currentPlayerIndex + 1 < players.length ? currentPlayerIndex + 1 : 0;
  turnCounter++;

  console.log("dsadsa");

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
