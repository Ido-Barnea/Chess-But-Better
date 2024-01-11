import {
  destroyItemOnBoard,
  destroyPieceOnBoard,
  movePieceOnBoard,
  spawnPieceOnBoard,
} from '../ui/BoardManager';
import { Logger } from '../ui/Logger';
import { HEAVEN_BOARD_ID, HELL_BOARD_ID, OVERWORLD_BOARD_ID } from './Constants';
import { 
  endTurn,
  getCurrentPlayer,
  increaseDeathCount,
  isCastling,
  items,
  pieces,
  switchIsCastling,
  triggerIsPieceKilled,
  updateFriendlyFireStatus,
  updateItems,
  updatePieces,
} from './GameController';
import { comparePositions, getPieceByPosition } from './Utilities';
import { Coin } from './items/Coin';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square } from './pieces/PiecesHelpers';

export function actOnTurn(
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

      handlePieceOnItem(draggedPiece, target);
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
  updateFriendlyFireStatus(targetPiece.player === draggedPiece.player);
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
    if (draggedPiece instanceof Pawn) {
      const draggedPieceAsPawn = draggedPiece as Pawn;
      if (draggedPieceAsPawn.enPassant) {
        if (!draggedPieceAsPawn.enPassantPosition) return;
        const targetPiece = getPieceByPosition(
          draggedPieceAsPawn.enPassantPosition,
        );
        if (!targetPiece) return;
        
        killPiece(draggedPiece, targetPiece, targetSquare.position);
      }
    }

    move(draggedPiece, targetSquare); 
  } else {
    switchIsCastling();
  }
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

function killPiece(
  draggedPiece: Piece,
  targetPiece: Piece,
  targetPosition = targetPiece.position,
) {
  draggedPiece.hasKilled = true;
  increaseDeathCount();
  triggerIsPieceKilled();
  destroyPieceOnBoard(targetPiece);
  killPieceProcess(draggedPiece, targetPiece, targetPosition);
}

export function permanentlyKillPiece(targetPiece: Piece) {
  updatePieces(pieces.filter((piece) => piece !== targetPiece));
  increaseDeathCount();
  triggerIsPieceKilled();
  destroyPieceOnBoard(targetPiece);
}

export function isAllowedToMove(draggedPiece: Piece) {
  return draggedPiece.player === getCurrentPlayer();
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
      `A ${targetPieceLogo} ${targetPieceColor} ${targetPieceName} was
      killed by a ${draggedPieceLogo} ${draggedPieceColor}
      ${draggedPieceName}.`,
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
    pieces.forEach(piece => {
      const areOnTheSamePosition = comparePositions(
        targetPiece.position,
        piece.position,
      );
      const areTheSame = piece === targetPiece;

      if (areOnTheSamePosition && !areTheSame) {
        permanentlyKillPiece(piece);
      }
    });

    // Handle piece spawning on item
    items.forEach(item => {
      const areOnTheSamePosition = comparePositions(
        targetPiece.position,
        item.position,
      );

      if (areOnTheSamePosition) {
        handlePieceOnItem(targetPiece, item);
      }
    });

    spawnPieceOnBoard(targetPiece);
  } else {
    Logger.logKill(
      `A ${targetPieceLogo} ${targetPieceColor} ${targetPieceName}
       was permanently killed by a ${draggedPieceLogo}
       ${draggedPieceColor} ${draggedPieceName}.`,
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

function handlePieceOnItem(draggedPiece: Piece, targetItem: Item) {
  switch (targetItem.name) {
    case ('trap'): {
      pieceMovedOnTrap(draggedPiece, targetItem);
      break;
    }
    case ('gold coin'): {
      pieceMovedOnCoin(draggedPiece, targetItem);
      break;
    }
  }
}

function pieceMovedOnTrap(draggedPiece: Piece, trap: Trap) {
  permanentlyKillPiece(draggedPiece);
  updateItems(items.filter((item) => item !== trap));
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
  updateItems(items.filter((item) => item !== coin));
  destroyItemOnBoard(coin);

  draggedPiece.player.gold++;

  Logger.logGeneral(`${draggedPiece.player.color} ${draggedPiece.name} 
   found a ${coin.name} on ${coin.position.coordinates}.`);
}
