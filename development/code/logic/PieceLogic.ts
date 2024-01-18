import { game } from '../Game';
import { destroyItemOnBoard, destroyPieceOnBoard, movePieceOnBoard, spawnPieceOnBoard } from '../LogicAdapter';
import { Logger } from '../ui/Logger';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from './Constants';
import { comparePositions } from './Utilities';
import { Coin } from './items/Coin';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square } from './pieces/PiecesUtilities';

function validatePlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
): boolean {
  if (!isPlayerAllowedToAct(draggedPiece)) return false;
  if (draggedPiece === target) return false;
  if (draggedPiece.position.boardId !== target.position.boardId) return false;

  const legalMoves = draggedPiece.getLegalMoves();
  return legalMoves.some(position => comparePositions(position, target.position));
}

function simulatePath(piece: Piece, endPosition: Position) {
  const legalMoves = piece.getLegalMoves();

  const isTargetSquare = (position: Position) => comparePositions(position, endPosition);
  const targetIndex = legalMoves.findIndex(isTargetSquare);
  if (targetIndex === -1) return;

  const positionsBeforeTarget = legalMoves.slice(0, targetIndex);
  positionsBeforeTarget.forEach(position => {
    game.getItems().forEach(item => {
      if (comparePositions(item.position, position)) onActionPieceToItem(piece, item);
    });
  });
}

export function onPlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
) {
  if (!validatePlayerAction(draggedPiece, target)) return;
  simulatePath(draggedPiece, target.position);

  if (target instanceof Piece) {
    onActionAttackMove(draggedPiece, target);
  } else {
    const targetSquare = (target instanceof Item) ? { position: target.position } : (target as Square);
    onActionNonAttackMove(draggedPiece, target, targetSquare);
  }
}

function onActionNonAttackMove(
  draggedPiece: Piece,
  target: Piece | Square | Item,
  targetSquare: Square,
) {
  if (target instanceof Item) {
    onActionPieceToItem(draggedPiece, target);
  }

  onActionPieceToSquare(draggedPiece, targetSquare);
}

export function onPieceFellOffTheBoard(draggedPiece: Piece) {
  permanentlyKillPiece(draggedPiece, draggedPiece);
  game.setFellOffTheBoardPiece(draggedPiece);
  game.endTurn();
}

function onActionAttackMove(
  draggedPiece: Piece,
  targetPiece: Piece,
) {
  game.setIsFriendlyFire(targetPiece.player === draggedPiece.player);
  killPiece(draggedPiece ,targetPiece);

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare);
}

function onActionPieceToSquare(
  draggedPiece: Piece,
  targetSquare: Square,
) {
  if (game.getIsCaslting()) {
    const isValidCastling = castle(draggedPiece as King, targetSquare);

    if (!isValidCastling) {
      game.switchIsCastling();
      return;
    }
  }

  if (draggedPiece instanceof Pawn) {
    draggedPiece.checkInitialDoubleStep(targetSquare.position);

    if (draggedPiece.diagonalAttackPosition) {
      if (comparePositions(draggedPiece.diagonalAttackPosition, targetSquare.position)) {
        const enPassantPiece = draggedPiece.getEnPassantPiece(targetSquare.position);
        if (!enPassantPiece) return;
  
        killPiece(draggedPiece, enPassantPiece, targetSquare.position);
      }
    }
  }

  move(draggedPiece, targetSquare);
}

function castle(
  kingPiece: King,
  targetSquare: Square,
) {
  const targetXPosition = targetSquare.position.coordinates[0];
  const kingXPosition = kingPiece.position.coordinates[0];
  const deltaX = targetXPosition - kingXPosition;
  const isKingsideCastling = deltaX > 0;
  
  const rookPiece = kingPiece.getRookForCastling(kingPiece.player, isKingsideCastling);
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

  Logger.logGeneral(`${kingPiece.pieceLogo} ${kingPiece.player.color} castled.`);
  return true;
}

export function isPlayerAllowedToAct(draggedPiece: Piece) {
  return draggedPiece.player === game.getCurrentPlayer();
}

function move(
  draggedPiece: Piece,
  targetSquare: Square,
  shouldEndTurn = true,
) {
  Logger.logMovement(draggedPiece, targetSquare);
  movePieceOnBoard(draggedPiece, targetSquare);

  draggedPiece.position = {
    coordinates: targetSquare.position.coordinates,
    boardId: draggedPiece.position.boardId,
  };

  draggedPiece.hasMoved = true;
  if (shouldEndTurn) game.endTurn();
}

function commonKillPieceActions(targetPiece: Piece) {
  game.increaseDeathCounter();
  game.setIsPieceKilled(true);
  destroyPieceOnBoard(targetPiece);
}

function logKillMessages(
  targetPiece: Piece,
  draggedPiece: Piece,
  permanent = false,
) {
  const {
    pieceLogo: targetPieceLogo,
    player: { color: targetPieceColor },
    name: targetPieceName,
  } = targetPiece;

  const {
    pieceLogo: draggedPieceLogo,
    player: { color: draggedPieceColor },
    name: draggedPieceName,
  } = draggedPiece;

  Logger.logKill(`
    A ${targetPieceLogo} ${targetPieceColor} ${targetPieceName} was ${permanent ? 'permanently ' : ''} killed
    by a ${draggedPieceLogo} ${draggedPieceColor} ${draggedPieceName}.
  `);
}

function killPiece(
  draggedPiece: Piece,
  targetPiece: Piece,
  targetPosition = targetPiece.position,
) {
  draggedPiece.hasKilled = true;
  commonKillPieceActions(targetPiece);

  logKillMessages(targetPiece, draggedPiece);

  if (targetPiece.position.boardId === OVERWORLD_BOARD_ID) {
    handleOverworldKill(targetPiece, targetPosition);
  } else {
    permanentlyKillPiece(targetPiece, draggedPiece);
  }
}

function handlePieceSpawning(targetPiece: Piece) {
  game.getPieces().forEach((piece) => {
    const areOnTheSamePosition = comparePositions(
      targetPiece.position,
      piece.position,
    );
    const areTheSame = piece === targetPiece;

    if (areOnTheSamePosition && !areTheSame) {
      permanentlyKillPiece(piece, targetPiece);
    }
  });

  game.getItems().forEach((item) => {
    onActionPieceToItem(targetPiece, item);
  });

  spawnPieceOnBoard(targetPiece);
}

function handleOverworldKill(
  targetPiece: Piece,
  targetPosition: Position,
) {
  targetPiece.position = targetPosition;

  if (targetPiece.hasKilled) {
    targetPiece.position.boardId = HELL_BOARD_ID;
  } else {
    targetPiece.position.boardId = HEAVEN_BOARD_ID;
  }

  handlePieceSpawning(targetPiece);
}

export function permanentlyKillPiece(targetPiece: Piece, draggedPiece: Piece) {
  logKillMessages(targetPiece, draggedPiece, true);
  game.setPieces(game.getPieces().filter((piece) => piece !== targetPiece));
  commonKillPieceActions(targetPiece);
}

function onActionPieceToItem(piece: Piece, item: Item) {
  switch (item.name) {
    case ('gold coin'): {
      pieceMovedOnCoin(piece, item);
      break;
    }
    case ('trap'): {
      pieceMovedOnTrap(piece, item);
      break;
    }
  }
}

function pieceMovedOnTrap(
  draggedPiece: Piece,
  trap: Trap,
) {
  permanentlyKillPiece(draggedPiece, draggedPiece);
  game.setItems(game.getItems().filter((item) => item !== trap));
  destroyItemOnBoard(trap);

  if (draggedPiece.position.boardId === OVERWORLD_BOARD_ID) {
    draggedPiece.position = {...trap.position};
    draggedPiece.position.boardId = draggedPiece.hasKilled
      ? HELL_BOARD_ID
      : HEAVEN_BOARD_ID;
    spawnPieceOnBoard(draggedPiece);
  }

  game.endTurn();
}

export function pieceMovedOnCoin(
  draggedPiece: Piece,
  coin: Coin,
) {
  game.setItems(game.getItems().filter((item) => item !== coin));
  destroyItemOnBoard(coin);

  draggedPiece.player.gold++;

  Logger.logGeneral(`
    ${draggedPiece.player.color} ${draggedPiece.name} found a ${coin.name} on ${coin.position.coordinates}.
  `);
}
