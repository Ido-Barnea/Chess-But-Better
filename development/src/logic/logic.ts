import { Player, PlayerColors } from './players';
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
  enPassantPosition,
  resetEnPassantPosition,
} from './pieces';
import { Logger } from '../ui/logger';
import {
  movePieceOnBoard,
  destroyPieceOnBoard,
  spawnPieceOnBoard,
  destroyItemOnBoard,
} from '../ui/boards';
import { activeRules } from './rules';
import { updatePlayersInformation } from '../game';
import { Item } from './items/items';
import { HEAVEN_BOARD_ID, HELL_BOARD_ID, OVERWORLD_BOARD_ID } from './constants';
import { Trap } from './items/trap';
import { Coin } from './items/coin';

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);
export const players = [whitePlayer, blackPlayer];
export let pieces = [
  new Rook({ coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Queen({ coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new King({ coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Rook({ coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Queen({ coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new King({ coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
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
  const areBoardsEqual = firstPosition.boardId === secondPosition.boardId;

  return areBoardsEqual && arePositionsEqual;
}

export function switchIsCastling() {
  isCastling = !isCastling;
}

export function getPieceByPositionAndBoard(
  position: Position,
): Piece | undefined {
  return pieces.find((piece) => {
    return comparePositions(position, piece.position);
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

  const squareId = draggedElementParentElement.getAttribute('square-id');
  if (!squareId) return;

  const draggedElementPosition: Position = {
    coordinates: convertSquareIdToPosition(squareId),
    boardId: board,
  };

  const draggedPiece: Piece | undefined = pieces.find((piece) =>
    comparePositions(
      piece.position,
      draggedElementPosition,
    ),
  );

  if (targetElement.classList.contains('piece')) {
    const squareElement = targetElement.parentElement;
    const squareId = squareElement?.getAttribute('square-id');
    if (!squareId) return;

    const targetElementPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    const targetPiece: Piece | undefined = pieces.find((piece) => {
      return comparePositions(
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

    const squareId = squareElement.getAttribute('square-id');
    if (!squareId) return;

    const itemPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    items.forEach((item) => {
      if (comparePositions(item.position, itemPosition)) {
        actOnTurn(draggedPiece, item);
      }
    });
  } else {
    const squareId = targetElement.getAttribute('square-id');
    if (!squareId) return;

    const targetSquare: Square = {
      position: {
        coordinates: convertSquareIdToPosition(squareId),
        boardId: board,
      },
    };
    actOnTurn(draggedPiece, targetSquare);
  }
}

export function onFallOffTheBoard(draggedElement: HTMLElement, board: string) {
  const draggedPiece: Piece | undefined = pieces.find((piece) => {
    const squareElement = draggedElement.parentElement;
    const squareId = squareElement?.getAttribute('square-id');
    if (!squareId) return;

    const draggedElementPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    return comparePositions(
      draggedElementPosition,
      piece.position,
    );
  });

  if (!draggedPiece) return;
  if (!isAllowedToMove(draggedPiece)) return;

  permanentlyKillPiece(draggedPiece);
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
  if (draggedPiece.position.boardId !== target.position.boardId) return;

  const targetPosition = draggedPiece.validateMove(target);
  if (comparePositions(targetPosition, draggedPiece.position)) return;

  if (target instanceof Piece) {
    const targetPiece = target as Piece;
    actOnTurnPieceToPiece(draggedPiece, targetPiece);
  } else {
    let targetSquare: Square;
    if (target instanceof Item) {
      targetSquare = {
        position: target.position,
      };

      const targetItem = target as Item;
      switch (targetItem.name) {
        case ('trap'): {
          pieceMovedOnTrap(draggedPiece, targetItem);
          break;
        }
      }
    } else {
      targetSquare = target as Square;
    }

    actOnTurnPieceToSquare(draggedPiece, targetSquare);
  }
}
export function actOnTurnPieceToPiece(
  draggedPiece: Piece,
  targetPiece: Piece,
) {
  isFriendlyFire = targetPiece.player === draggedPiece.player;

  killPiece(draggedPiece ,targetPiece);

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare);
}

function actOnTurnPieceToSquare(draggedPiece: Piece, targetSquare: Square) {
  let isValidCastling = true;
  if (isCastling) {
    isValidCastling = castle(draggedPiece, targetSquare);
  }

  if (isValidCastling) {
    if (draggedPiece instanceof Pawn && draggedPiece.enPassant){
      if (!enPassantPosition) return;
      const targetPiece = getPieceByPositionAndBoard(enPassantPosition);
      if (!targetPiece) return;
      
      killPiece(draggedPiece, targetPiece, targetSquare.position);
    }

    move(draggedPiece, targetSquare); 
  } else {
    switchIsCastling();
  }
}

function pieceMovedOnTrap(draggedPiece: Piece, trap: Trap) {
  permanentlyKillPiece(draggedPiece);
  items = items.filter((item) => item !== trap);
  destroyItemOnBoard(trap);

  if (draggedPiece.position.boardId === OVERWORLD_BOARD_ID) {
    draggedPiece.position = {...trap.position};
    draggedPiece.position.boardId = draggedPiece.hasKilled
      ? HELL_BOARD_ID
      : HEAVEN_BOARD_ID;
    spawnPieceOnBoard(draggedPiece);
  }

  endTurn();
}

export function pieceMovedOnCoin(draggedPiece: Piece, coin: Coin) {
  items = items.filter((item) => item !== coin);
  destroyItemOnBoard(coin);

  draggedPiece.player.gold++;

  Logger.logGeneral(`${draggedPiece.player.color} ${draggedPiece.name} 
   found a ${coin.name} on ${coin.position.coordinates}.`);
}

function killPieceProcess(
  draggedPiece: Piece,
  targetPiece: Piece,
  targetPosition: Position,
) {
  const targetPieceLogo = targetPiece.pieceLogo;
  const targetPieceColor = targetPiece.player.color;
  const targetPieceName = targetPiece.name;
  const draggedPieceLogo = draggedPiece.pieceLogo;
  const draggedPieceColor = draggedPiece.player.color;
  const draggedPieceName = draggedPiece.name;

  if (targetPiece.position.boardId === OVERWORLD_BOARD_ID) {
    targetPiece.position = targetPosition;

    Logger.logKill(
      `A 
      ${targetPieceLogo} ${targetPieceColor} ${targetPieceName}
      was killed by a 
      ${draggedPieceLogo} ${draggedPieceColor} ${draggedPieceName}
      .`,
    );

    if (targetPiece.hasKilled) {
      targetPiece.position = {
        coordinates: targetPiece.position.coordinates,
        boardId: HELL_BOARD_ID,
      };
    } else {
      targetPiece.position = {
        coordinates: targetPiece.position.coordinates,
        boardId: HEAVEN_BOARD_ID,
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
        permanentlyKillPiece(piece);
      }
    });

    spawnPieceOnBoard(targetPiece);
  } else {
    Logger.logKill(
      `A 
      ${targetPieceLogo} ${targetPieceColor} ${targetPieceName}
       was permanently killed by a 
      ${draggedPieceLogo} ${draggedPieceColor} ${draggedPieceName}
      .`,
    );
    
    pieces.forEach((piece) => {
      const areOnTheSamePosition = comparePositions(
        targetPiece.position,
        piece.position,
      );
      const areTheSame = piece === targetPiece;

      if (areOnTheSamePosition && !areTheSame) {
        permanentlyKillPiece(piece);
      }
    });

  }
}

function killPiece(
  draggedPiece: Piece,
  targetPiece: Piece,
  targetPosition = targetPiece.position,
) {
  draggedPiece.hasKilled = true;
  deathCounter++;
  isPieceKilled = true;
  destroyPieceOnBoard(targetPiece);
  killPieceProcess(draggedPiece, targetPiece, targetPosition);
}

function permanentlyKillPiece(targetPiece: Piece) {
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

  const targetXPosition = targetSquare.position.coordinates[0];
  const kingXPosition = kingPiece.position.coordinates[0];
  const deltaX = targetXPosition - kingXPosition;
  // Depends on if it's Kingside or Queenside castling
  const isKingsideCastling = deltaX > 0;
  const rookFilter = (piece: Piece) => {
    const isValidCastling = isKingsideCastling
      ? piece.position.coordinates[0] > kingPiece.position.coordinates[0]
      : piece.position.coordinates[0] < kingPiece.position.coordinates[0];
    
    const pieceBoardId = piece.position.boardId;
    const kingBoardId = kingPiece.position.boardId;
    const areOnTheSameBoard = pieceBoardId === kingBoardId;
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
    boardId: rookPiece.position.boardId,
  };

  const rookPieceTargetSquare: Square = { position: rookPieceTargetPosition };
  move(rookPiece, rookPieceTargetSquare, false);
  Logger.logGeneral(
    `${kingPiece.pieceLogo} ${kingPiece.player.color} castled.`,
  );
  return true;
}

function move(draggedPiece: Piece, targetSquare: Square, shouldEndTurn = true) {
  Logger.logMovement(draggedPiece, targetSquare);

  movePieceOnBoard(draggedPiece, targetSquare);

  draggedPiece.position = {
    ...targetSquare.position,
    boardId: draggedPiece.position.boardId,
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
  pieces.forEach((piece) => {
    if (piece.player !== getCurrentPlayer() && piece instanceof Pawn){
      piece.enPassant = false;
    }
  });

  if (
    enPassantPosition &&
    getCurrentPlayer() !== getPieceByPositionAndBoard(enPassantPosition)?.player
  ) {
    resetEnPassantPosition();
  }
}
