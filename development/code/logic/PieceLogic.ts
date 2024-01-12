import { game } from '../Game';
import { destroyItemOnBoard, destroyPieceOnBoard, movePieceOnBoard, spawnPieceOnBoard } from '../LogicAdapter';
import { Logger } from '../ui/Logger';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from './Constants';
import { comparePositions, getPieceByPosition } from './Utilities';
import { Coin } from './items/Coin';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square, getItemByPosition } from './pieces/PiecesUtilities';

function validatePlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
): boolean {
  if (!isAllowedToAct(draggedPiece)) return false;
  if (draggedPiece === target) return false;
  if (draggedPiece.position.boardId !== target.position.boardId) return false;

  const validMoves = draggedPiece.getValidMoves();
  return validMoves.some(position => comparePositions(position, target.position));
}

function handleTargetType(
  draggedPiece: Piece,
  target: Piece | Square | Item,
  targetSquare: Square,
) {
  if (target instanceof Item) {
    handlePieceOnItem(draggedPiece, target);
  }

  onActionPieceToSquare(draggedPiece, targetSquare);
}

export function onPlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
) {
  if (!validatePlayerAction(draggedPiece, target)) return;

  if (target instanceof Piece) {
    onActionPieceToPiece(draggedPiece, target);
  } else {
    const targetSquare = (target instanceof Item) ? { position: target.position } : (target as Square);
    handleTargetType(draggedPiece, target, targetSquare);
  }
}

export function onPieceFellOffTheBoard(draggedPiece: Piece) {
  permanentlyKillPiece(draggedPiece, draggedPiece);
  game.setFellOffTheBoardPiece(draggedPiece);
  game.endTurn();
}

function onActionPieceToPiece(
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
    const isValidCastling = castle(draggedPiece, targetSquare);

    if (!isValidCastling) {
      game.switchIsCastling();
      return;
    }
  }

  if (draggedPiece instanceof Pawn) {
    const draggedPawn = draggedPiece as Pawn;
    if (draggedPawn.enPassant) {
      const enPassantPosition = draggedPawn.enPassantPosition;
      if (!enPassantPosition) return;

      const targetPiece = getPieceByPosition(enPassantPosition);
      if (!targetPiece) return;

      killPiece(draggedPiece, targetPiece, targetSquare.position);
    }
  }

  move(draggedPiece, targetSquare);
}

function castle(
  kingPiece: Piece,
  targetSquare: Square,
) {
  const possibleRooks = game.getPieces().filter((piece) => {
    return (
      piece.player === game.getCurrentPlayer() &&
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

  Logger.logGeneral(`${kingPiece.pieceLogo} ${kingPiece.player.color} castled.`);
  return true;
}

export function isAllowedToAct(draggedPiece: Piece) {
  return draggedPiece.player === game.getCurrentPlayer();
}

function move(
  draggedPiece: Piece,
  targetSquare: Square,
  shouldEndTurn = true,
) {
  Logger.logMovement(draggedPiece, targetSquare);

  handleMovingOnItem(draggedPiece, targetSquare.position);
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
    const areOnTheSamePosition = comparePositions(
      targetPiece.position,
      item.position,
    );

    if (areOnTheSamePosition) {
      handlePieceOnItem(targetPiece, item);
    }
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

function handlePieceOnItem(draggedPiece: Piece, targetItem: Item) {
  switch (targetItem.name) {
    case ('trap'): {
      pieceMovedOnTrap(draggedPiece, targetItem);
      break;
    }
  }
}

function handleMovingOnItem(piece: Piece, position: Position) {
  const item = getItemByPosition(position);
  if (item) {
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
