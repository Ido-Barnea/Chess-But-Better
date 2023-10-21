import { Player } from './players';
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
} from './pieces';
import { Logger } from './logger';
import {
  movePieceOnBoard,
  destroyPieceOnBoard,
  spawnPieceOnBoard,
  OVERWORLD_BOARD_ID,
  HELL_BOARD_ID,
  HEAVEN_BOARD_ID,
  destroyItemOnBoard,
} from './boards';
import { activeRules } from './rules';
import { updatePlayersInformation } from './game';
import { Inventory, Item } from './items';

const whitePlayer: Player = {
  color: 'white',
  xp: 0,
  gold: 0,
  inventory: new Inventory(),
};
const blackPlayer: Player = {
  color: 'black',
  xp: 0,
  gold: 0,
  inventory: new Inventory(),
};
export const players = [whitePlayer, blackPlayer];
export let pieces = [
  new Rook({ position: [0, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Knight({ position: [1, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Bishop({ position: [2, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Queen({ position: [3, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new King({ position: [4, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Bishop({ position: [5, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Knight({ position: [6, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Rook({ position: [7, 0], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [0, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [1, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [2, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [3, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [4, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [5, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [6, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [7, 1], board: OVERWORLD_BOARD_ID }, players[1]),
  new Pawn({ position: [0, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [1, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [2, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [3, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [4, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [5, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [6, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Pawn({ position: [7, 6], board: OVERWORLD_BOARD_ID }, players[0]),
  new Rook({ position: [0, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Knight({ position: [1, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Bishop({ position: [2, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Queen({ position: [3, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new King({ position: [4, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Bishop({ position: [5, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Knight({ position: [6, 7], board: OVERWORLD_BOARD_ID }, players[0]),
  new Rook({ position: [7, 7], board: OVERWORLD_BOARD_ID }, players[0]),
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
  return (
    firstPosition.position[0] === secondPosition.position[0] &&
    firstPosition.position[1] === secondPosition.position[1]
  );
}

export function comparePositionsAndBoards(
  firstPosition: Position,
  secondPosition: Position,
): boolean {
  const arePositionsEqual =
    firstPosition.position[0] === secondPosition.position[0] &&
    firstPosition.position[1] === secondPosition.position[1];
  const areBoardsEqual = firstPosition.board === secondPosition.board;

  return areBoardsEqual && arePositionsEqual;
}

export function switchIsCastling() {
  isCastling = !isCastling;
}

export function getPieceByPosition(
  position: Position,
): Piece | undefined {
  return pieces.find((piece) => comparePositions(position, piece.position));
}

export function getPieceByPositionAndBoard(
  position: Position,
): Piece | undefined {
  return pieces.find((piece) => {
    return comparePositionsAndBoards(position, piece.position);
  });
}

function convertSquareIdToPosition(squareId: string): [number, number] {
  return squareId.split(',').map((str) => parseInt(str)) as [number, number];
}

export function onAction(
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  board: string,
) {
  const draggedElementParentElement =
    draggedElement.parentElement as HTMLElement;

  const draggedElementPosition: Position = {
    position: convertSquareIdToPosition(
      draggedElementParentElement.getAttribute('square-id')!,
    ),
    board: board,
  };

  const draggedPiece: Piece | undefined = pieces.find((piece) =>
    comparePositionsAndBoards(
      piece.position,
      draggedElementPosition,
    ),
  );

  if (targetElement.classList.contains('piece')) {
    const targetPiece: Piece | undefined = pieces.find((piece) => {
      const squareElement = targetElement.parentElement!;
      const targetElementPosition: Position = {
        position:  convertSquareIdToPosition(
          squareElement.getAttribute('square-id')!,
        ),
        board: board,
      };

      return comparePositionsAndBoards(
        targetElementPosition,
        piece.position,
      );
    });

    actOnTurn(draggedPiece, targetPiece);
  } else if (targetElement.classList.contains('item')) {
    let squareElement = targetElement as HTMLElement;
    while (!squareElement.getAttribute('square-id')) {
      squareElement = squareElement.parentElement as HTMLElement;
    }

    const itemPosition: Position = {
      position: convertSquareIdToPosition(
        squareElement.getAttribute('square-id')!,
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
        position: convertSquareIdToPosition(
          targetElement.getAttribute('square-id')!,
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
      position: convertSquareIdToPosition(
        squareElement.getAttribute('square-id')!,
      ),
      board: board,
    };

    return comparePositionsAndBoards(
      draggedElementPosition,
      piece.position,
    );
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
  Logger.log(`A ${targetPiece.player.color} ${targetPiece.name} was killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`);

  isFriendlyFire = targetPiece.player === draggedPiece.player;
  draggedPiece.hasKilled = true;

  destroyPieceOnBoard(targetPiece);

  if (targetPiece.position.board === OVERWORLD_BOARD_ID) {
    targetPiece.position.board = targetPiece.hasKilled ? HELL_BOARD_ID : HEAVEN_BOARD_ID;

    // If a piece dies and spawns on another piece, the other piece dies permanently.
    pieces.forEach((piece) => {
      const areOnTheSamePosition = comparePositionsAndBoards(
        targetPiece.position,
        piece.position,
      );
      const areTheSame = piece == targetPiece;

      if (areOnTheSamePosition && !areTheSame) {
        killPiece(piece);
      }
    });

    spawnPieceOnBoard(targetPiece);
  } else {
    Logger.log(`A ${targetPiece.player.color} ${targetPiece.name} was permanently killed by a ${draggedPiece.player.color} ${draggedPiece.name}.`);
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
    draggedPiece.position = targetItem.position;
    draggedPiece.position.board = draggedPiece.hasKilled ? HELL_BOARD_ID : HEAVEN_BOARD_ID;
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
      piece.name === 'Rook'
    );
  });

  const deltaX = targetSquare.position.position[0] - kingPiece.position.position[0];
  // Depends on if it's Kingside or Queenside castling
  const isKingsideCastling = deltaX > 0;
  const rookFilter = (piece: Piece) =>
    isKingsideCastling
      ? piece.position.position[0] > kingPiece.position.position[0]
      : piece.position.position[0] < kingPiece.position.position[0];
  const rookPiece = possibleRooks.find(rookFilter);
  if (!rookPiece) return false;

  const rookPieceTargetPosition: Position = {
    position: [
      isKingsideCastling
        ? targetSquare.position.position[0] - 1
        : targetSquare.position.position[0] + 1,
      kingPiece.position.position[1],
    ],
    board: rookPiece.position.board,
  };

  const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition };
  move(rookPiece, rookPieceTargetSquare);
  Logger.log(`${kingPiece.player.color} castled.`);
  return true;
}

function move(draggedPiece: Piece, targetSquare: Square) {
  Logger.logMovement(draggedPiece, targetSquare);

  movePieceOnBoard(draggedPiece, targetSquare);

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
