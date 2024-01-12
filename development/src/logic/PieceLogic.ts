import { destroyItemOnBoard, destroyPieceOnBoard, movePieceOnBoard, spawnPieceOnBoard } from '../LogicAdapter';
import { Logger } from '../ui/Logger';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from './Constants';
import { Game } from './Game';
import { comparePositions, getPieceByPosition } from './Utilities';
import { Coin } from './items/Coin';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square } from './pieces/PiecesHelpers';

function validatePlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
): boolean {
  if (!isAllowedToAct(draggedPiece)) return false;
  if (draggedPiece === target) return false;
  if (draggedPiece.position.boardId !== target.position.boardId) return false;

  const targetPosition = draggedPiece.validateMove(target);
  if (comparePositions(targetPosition, draggedPiece.position)) return false;

  return true;
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
  permanentlyKillPiece(draggedPiece);
  Game.updateFellOffTheBoardPiece(draggedPiece);
  Game.endTurn();
}

function onActionPieceToPiece(
  draggedPiece: Piece,
  targetPiece: Piece,
) {
  Game.updateFriendlyFireStatus(targetPiece.player === draggedPiece.player);
  killPiece(draggedPiece ,targetPiece);

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare);
}

function onActionPieceToSquare(
  draggedPiece: Piece,
  targetSquare: Square,
) {
  if (Game.isCastling) {
    const isValidCastling = castle(draggedPiece, targetSquare);

    if (!isValidCastling) {
      Game.switchIsCastling();
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
  const possibleRooks = Game.pieces.filter((piece) => {
    return (
      piece.player === Game.getCurrentPlayer() &&
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
  return draggedPiece.player === Game.getCurrentPlayer();
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
  if (shouldEndTurn) Game.endTurn();
}

function commonKillPieceActions(targetPiece: Piece) {
  Game.increaseDeathCount();
  Game.triggerIsPieceKilled();
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
    handlePermanentKill(targetPiece, draggedPiece);
  }
}

function handlePieceSpawning(targetPiece: Piece) {
  Game.pieces.forEach((piece) => {
    const areOnTheSamePosition = comparePositions(
      targetPiece.position,
      piece.position,
    );
    const areTheSame = piece === targetPiece;

    if (areOnTheSamePosition && !areTheSame) {
      permanentlyKillPiece(piece);
    }
  });

  Game.items.forEach((item) => {
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

export function permanentlyKillPiece(targetPiece: Piece) {
  Game.updatePieces(Game.pieces.filter((piece) => piece !== targetPiece));
  commonKillPieceActions(targetPiece);
}

function handlePermanentKill(
  targetPiece: Piece,
  draggedPiece: Piece,
) {
  logKillMessages(targetPiece, draggedPiece, true);
  handlePieceSpawning(targetPiece);
}

function handlePieceOnItem(draggedPiece: Piece, targetItem: Item) {
  switch (targetItem.name) {
    case ('trap'): {
      handlePieceMovedOnTrap(draggedPiece, targetItem);
      break;
    }
  }
}

function handlePieceMovedOnTrap(
  draggedPiece: Piece,
  trap: Trap,
) {
  permanentlyKillPiece(draggedPiece);
  Game.updateItems(Game.items.filter((item) => item !== trap));
  destroyItemOnBoard(trap);

  if (draggedPiece.position.boardId === OVERWORLD_BOARD_ID) {
    draggedPiece.position = {...trap.position};
    draggedPiece.position.boardId = draggedPiece.hasKilled
      ? HELL_BOARD_ID
      : HEAVEN_BOARD_ID;
    spawnPieceOnBoard(draggedPiece);
  }

  Game.endTurn();
}

export function handlePieceMovedOnCoin(
  draggedPiece: Piece,
  coin: Coin,
) {
  Game.updateItems(Game.items.filter((item) => item !== coin));
  destroyItemOnBoard(coin);

  draggedPiece.player.gold++;

  Logger.logGeneral(`
    ${draggedPiece.player.color} ${draggedPiece.name} found a ${coin.name} on ${coin.position.coordinates}.
  `);
}
