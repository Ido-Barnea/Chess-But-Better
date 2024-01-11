import { destroyItemOnBoard, destroyPieceOnBoard, movePieceOnBoard, spawnPieceOnBoard } from '../LogicAdapter';
import { Logger } from '../ui/Logger';
import {
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
} from './Constants';
import { Game } from './GameController';
import { comparePositions, getPieceByPosition } from './Utilities';
import { Coin } from './items/Coin';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square } from './pieces/PiecesHelpers';

function validatePlayerAction(
  game: Game,
  draggedPiece: Piece,
  target: Piece | Square | Item,
): boolean {
  if (!isAllowedToAct(game, draggedPiece)) return false;
  if (draggedPiece === target) return false;
  if (draggedPiece.position.boardId !== target.position.boardId) return false;

  const targetPosition = draggedPiece.validateMove(target);
  if (comparePositions(targetPosition, draggedPiece.position)) return false;

  return true;
}

function handleTargetType(
  game: Game,
  draggedPiece: Piece,
  target: Piece | Square | Item,
  targetSquare: Square,
) {
  if (target instanceof Item) {
    handlePieceOnItem(game, draggedPiece, target);
  }

  onActionPieceToSquare(game, draggedPiece, targetSquare);
}

export function onPlayerAction(
  game: Game,
  draggedPiece: Piece,
  target: Piece | Square | Item,
) {
  if (!validatePlayerAction(game, draggedPiece, target)) return;

  if (target instanceof Piece) {
    onActionPieceToPiece(game, draggedPiece, target);
  } else {
    const targetSquare = (target instanceof Item) ? { position: target.position } : (target as Square);
    handleTargetType(game, draggedPiece, target, targetSquare);
  }
}

export function onPieceFellOffTheBoard(game: Game, draggedPiece: Piece) {
  permanentlyKillPiece(game, draggedPiece);
  game.updateFellOffTheBoardPiece(draggedPiece);
  game.endTurn();
}

function onActionPieceToPiece(
  game: Game,
  draggedPiece: Piece,
  targetPiece: Piece,
) {
  game.updateFriendlyFireStatus(targetPiece.player === draggedPiece.player);
  killPiece(game, draggedPiece ,targetPiece);

  const targetSquare: Square = { position: targetPiece.position };
  move(game, draggedPiece, targetSquare);
}

function onActionPieceToSquare(
  game: Game,
  draggedPiece: Piece,
  targetSquare: Square,
) {
  if (game.isCastling) {
    const isValidCastling = castle(game, draggedPiece, targetSquare);

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

      const targetPiece = getPieceByPosition(game, enPassantPosition);
      if (!targetPiece) return;

      killPiece(game, draggedPiece, targetPiece, targetSquare.position);
    }
  }

  move(game, draggedPiece, targetSquare);
}

function castle(
  game: Game,
  kingPiece: Piece,
  targetSquare: Square,
) {
  const possibleRooks = game.pieces.filter((piece) => {
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
  move(game, rookPiece, rookPieceTargetSquare, false);

  Logger.logGeneral(`${kingPiece.pieceLogo} ${kingPiece.player.color} castled.`);
  return true;
}

export function isAllowedToAct(game: Game, draggedPiece: Piece) {
  return draggedPiece.player === game.getCurrentPlayer();
}

function move(
  game: Game,
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

function commonKillPieceActions(game: Game, targetPiece: Piece) {
  game.increaseDeathCount();
  game.triggerIsPieceKilled();
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
  game: Game,
  draggedPiece: Piece,
  targetPiece: Piece,
  targetPosition = targetPiece.position,
) {
  draggedPiece.hasKilled = true;
  commonKillPieceActions(game, targetPiece);

  logKillMessages(targetPiece, draggedPiece);

  if (targetPiece.position.boardId === OVERWORLD_BOARD_ID) {
    handleOverworldKill(game, targetPiece, targetPosition);
  } else {
    handlePermanentKill(game, targetPiece, draggedPiece);
  }
}

function handlePieceSpawning(game: Game, targetPiece: Piece) {
  game.pieces.forEach((piece) => {
    const areOnTheSamePosition = comparePositions(
      targetPiece.position,
      piece.position,
    );
    const areTheSame = piece === targetPiece;

    if (areOnTheSamePosition && !areTheSame) {
      permanentlyKillPiece(game, piece);
    }
  });

  game.items.forEach((item) => {
    const areOnTheSamePosition = comparePositions(
      targetPiece.position,
      item.position,
    );

    if (areOnTheSamePosition) {
      handlePieceOnItem(game, targetPiece, item);
    }
  });

  spawnPieceOnBoard(targetPiece);
}

function handleOverworldKill(
  game: Game,
  targetPiece: Piece,
  targetPosition: Position,
) {
  targetPiece.position = targetPosition;

  if (targetPiece.hasKilled) {
    targetPiece.position.boardId = HELL_BOARD_ID;
  } else {
    targetPiece.position.boardId = HEAVEN_BOARD_ID;
  }

  handlePieceSpawning(game, targetPiece);
}

export function permanentlyKillPiece(game: Game, targetPiece: Piece) {
  game.updatePieces(game.pieces.filter((piece) => piece !== targetPiece));
  commonKillPieceActions(game, targetPiece);
}

function handlePermanentKill(
  game: Game,
  targetPiece: Piece,
  draggedPiece: Piece,
) {
  logKillMessages(targetPiece, draggedPiece, true);
  handlePieceSpawning(game, targetPiece);
}

function handlePieceOnItem(game: Game, draggedPiece: Piece, targetItem: Item) {
  switch (targetItem.name) {
    case ('trap'): {
      handlePieceMovedOnTrap(game, draggedPiece, targetItem);
      break;
    }
    case ('gold coin'): {
      handlePieceMovedOnCoin(game, draggedPiece, targetItem);
      break;
    }
  }
}

function handlePieceMovedOnTrap(
  game: Game,
  draggedPiece: Piece,
  trap: Trap,
) {
  permanentlyKillPiece(game, draggedPiece);
  game.updateItems(game.items.filter((item) => item !== trap));
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

export function handlePieceMovedOnCoin(
  game: Game,
  draggedPiece: Piece,
  coin: Coin,
) {
  game.updateItems(game.items.filter((item) => item !== coin));
  destroyItemOnBoard(coin);

  draggedPiece.player.gold++;

  Logger.logGeneral(`
    ${draggedPiece.player.color} ${draggedPiece.name} found a ${coin.name} on ${coin.position.coordinates}.
  `);
}
