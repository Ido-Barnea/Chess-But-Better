import { game } from '../Game';
import {
  destroyItemOnBoard,
  destroyPieceOnBoard,
  movePieceOnBoard,
  spawnPieceOnBoard,
  endGame,
  destroyItemOnPiece,
} from '../LogicAdapter';
import {
  MIN_KILLINGS_FOR_BOUNTY,
  HEAVEN_BOARD_ID,
  HELL_BOARD_ID,
  OVERWORLD_BOARD_ID,
  VOID_BOARD_ID,
} from '../Constants';
import { comparePositions } from './Utilities';
import { PiggyBank } from './items/PiggyBank';
import { Item } from './items/Items';
import { Trap } from './items/Trap';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Piece';
import { Position, Square } from './pieces/PiecesUtilities';
import { Player } from './Players';
import { Knight } from './pieces/Knight';
import { KillLog, Log, MovementLog } from '../ui/logs/Log';

function validatePlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
): boolean {
  if (!isPlayerAllowedToAct(draggedPiece.player)) return false;
  if (draggedPiece === target) return false;
  if (draggedPiece.position.boardId !== target.position?.boardId) return false;

  const legalMoves = draggedPiece.getLegalMoves();
  return legalMoves.some((position) =>
    comparePositions(position, target.position),
  );
}

function getPathPositions(start: Position, end: Position): Array<Position> {
  const path: Array<Position> = [];
  const deltaX = end.coordinates[0] - start.coordinates[0];
  const deltaY = end.coordinates[1] - start.coordinates[1];

  const xDirection = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
  const yDirection = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;

  const moveSteps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

  for (let index = 1; index <= moveSteps; index++) {
    const x = start.coordinates[0] + index * xDirection;
    const y = start.coordinates[1] + index * yDirection;
    path.push({
      coordinates: [x, y],
      boardId: start.boardId,
    });
  }

  return path;
}

function simulatePath(piece: Piece, targetPosition: Position) {
  const currentPosition = piece.position;
  const pathPositions: Array<Position> =
    piece instanceof Knight
      ? [targetPosition]
      : getPathPositions(currentPosition, targetPosition);

  pathPositions.forEach((position) => {
    game.getItems().forEach((item) => {
      if (comparePositions(item.position, position)) {
        onActionPieceToItem(piece, item);
      }
    });

    if (comparePositions(position, targetPosition)) return;
  });
}

function revertPieceMoveOnBoard(piece: Piece) {
  movePieceOnBoard(piece, piece.position);
}

export function onPieceFellOffTheBoard(draggedPiece: Piece) {
  draggedPiece.position.boardId = VOID_BOARD_ID;
  killPieceByGame(draggedPiece, 'the void');
  game.setFellOffTheBoardPiece(draggedPiece);
  game.endMove(false);
}

export function onPlayerAction(
  draggedPiece: Piece,
  target: Piece | Square | Item,
) {
  if (!validatePlayerAction(draggedPiece, target) || !target.position) {
    revertPieceMoveOnBoard(draggedPiece);
    return;
  }

  if (game.getMovesLeft() === 0) {
    game.setMovesLeft(draggedPiece.moves);
  }

  const pieceBoard = draggedPiece.position.boardId;
  simulatePath(draggedPiece, target.position);
  const newPieceBoard = draggedPiece.position.boardId;
  // Checks if the piece died during the simulatePath function.
  // If it did, return.
  if (pieceBoard !== newPieceBoard) return;

  if (target instanceof Piece) {
    onActionAttackMove(draggedPiece, target);
  } else {
    const targetSquare =
      target instanceof Item
        ? { position: target.position }
        : (target as Square);

    onActionNonAttackMove(draggedPiece, targetSquare);
  }
}

function onActionAttackMove(draggedPiece: Piece, targetPiece: Piece) {
  game.setIsFriendlyFire(targetPiece.player === draggedPiece.player);
  const isSuccessfulKill = killPieceByAnotherPiece(targetPiece, draggedPiece);
  if (!isSuccessfulKill) return;

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare.position);
}

function onActionNonAttackMove(draggedPiece: Piece, targetSquare: Square) {
  if (draggedPiece instanceof Pawn) {
    draggedPiece.checkInitialDoubleStep(targetSquare.position);

    if (draggedPiece.diagonalAttackPosition) {
      if (
        comparePositions(
          draggedPiece.diagonalAttackPosition,
          targetSquare.position,
        )
      ) {
        const enPassantPiece = draggedPiece.getEnPassantPiece(
          targetSquare.position,
        );
        if (!enPassantPiece) return;

        const isSuccessfulKill = killPieceByAnotherPiece(
          enPassantPiece,
          draggedPiece,
        );
        if (!isSuccessfulKill) return;
      }
    }
  }

  if (game.getIsCaslting()) {
    const isValidCastling = castle(draggedPiece as King, targetSquare);

    if (!isValidCastling) {
      game.switchIsCastling();
      return;
    }
  }

  move(draggedPiece, targetSquare.position);
}

function castle(kingPiece: King, targetSquare: Square) {
  const targetXPosition = targetSquare.position.coordinates[0];
  const kingXPosition = kingPiece.position.coordinates[0];
  const deltaX = targetXPosition - kingXPosition;
  const isKingsideCastling = deltaX > 0;

  const rookPiece = kingPiece.getRookForCastling(
    kingPiece.player,
    isKingsideCastling,
  );
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
  move(rookPiece, rookPieceTargetSquare.position, false);

  new Log(
    `${kingPiece.pieceIcon} ${kingPiece.player.color} castled.`,
  ).addToQueue();
  return true;
}

export function isPlayerAllowedToAct(player: Player) {
  return player === game.getCurrentPlayer();
}

function move(
  draggedPiece: Piece,
  targetPosition: Position,
  shouldEndTurn = true,
) {
  new MovementLog(draggedPiece, targetPosition).addToQueue();
  movePieceOnBoard(draggedPiece, targetPosition);

  draggedPiece.position = {
    coordinates: targetPosition.coordinates,
    boardId: draggedPiece.position.boardId,
  };

  draggedPiece.hasMoved = true;
  if (shouldEndTurn) game.endMove();
}

function failToKillPiece(draggedPiece: Piece, targetPiece: Piece) {
  destroyItemOnPiece(targetPiece);

  // Takes the difference of the dragged and target positions in both axis,
  // if the dragged position is higher - it would be positive, if lower - negative
  // then I use that to determine the direction to move away from the target position
  // and divide it by itself cause I wanna move by 1 in any direction
  let directionX = 0;
  let directionY = 0;
  const targetXPosition = targetPiece.position.coordinates[0];
  const targetYPosition = targetPiece.position.coordinates[1];
  const deltaX = draggedPiece.position.coordinates[0] - targetXPosition;
  const deltaY = draggedPiece.position.coordinates[1] - targetYPosition;
  if (deltaX !== 0) {
    directionX = deltaX / Math.abs(deltaX);
  }
  if (deltaY !== 0) {
    directionY = deltaY / Math.abs(deltaY);
  }

  const newPosition: Position = {
    coordinates: [targetXPosition + directionX, targetYPosition + directionY],
    boardId: draggedPiece.position.boardId,
  };
  movePieceOnBoard(draggedPiece, newPosition);
  draggedPiece.position = newPosition;

  game.endMove();
}

function killPieceByAnotherPiece(
  targetPiece: Piece,
  draggedPiece: Piece,
): boolean {
  targetPiece.health--;
  if (targetPiece.health > 0) {
    failToKillPiece(draggedPiece, targetPiece);
    return false;
  }

  draggedPiece.killCount++;
  if (targetPiece.killCount >= MIN_KILLINGS_FOR_BOUNTY) {
    draggedPiece.player.gold += targetPiece.killCount;
  }

  killPiece(targetPiece);
  new KillLog(targetPiece, draggedPiece).addToQueue();
  return true;
}

function killPieceByGame(targetPiece: Piece, killCause: string) {
  killPiece(targetPiece);
  new KillLog(targetPiece, killCause).addToQueue();
}

function killPiece(targetPiece: Piece) {
  game.increaseDeathCounter();
  game.setIsPieceKilled(true);

  if (targetPiece.position.boardId === OVERWORLD_BOARD_ID) {
    handleOverworldKill(targetPiece);
  } else {
    permanentlyKillPiece(targetPiece);
  }

  targetPiece.killCount = 0;
  return true;
}

function handleOverworldKill(targetPiece: Piece) {
  destroyPieceOnBoard(targetPiece);

  if (targetPiece.killCount > 0 || targetPiece instanceof King) {
    targetPiece.position.boardId = HELL_BOARD_ID;
  } else {
    targetPiece.position.boardId = HEAVEN_BOARD_ID;
  }

  handlePieceSpawning(targetPiece);
}

export function permanentlyKillPiece(targetPiece: Piece) {
  game.increaseDeathCounter();
  game.setIsPieceKilled(true);

  targetPiece.position.boardId = VOID_BOARD_ID;
  game.setPieces(game.getPieces().filter((piece) => piece !== targetPiece));

  if (targetPiece instanceof King) endGame();
}

function handlePieceSpawning(spawningPiece: Piece) {
  game.getPieces().forEach((piece) => {
    const areOnTheSamePosition = comparePositions(
      spawningPiece.position,
      piece.position,
    );
    const areTheSame = piece === spawningPiece;

    if (areOnTheSamePosition && !areTheSame) {
      permanentlyKillPiece(piece);
    }
  });

  game.getItems().forEach((item) => {
    if (comparePositions(spawningPiece.position, item.position)) {
      onActionPieceToItem(spawningPiece, item);
    }
  });

  spawnPieceOnBoard(spawningPiece);
}

function onActionPieceToItem(piece: Piece, item: Item) {
  switch (item.name) {
    case 'piggy bank': {
      pieceMovedOnPiggyBank(piece, item as PiggyBank);
      break;
    }
    case 'trap': {
      pieceMovedOnTrap(piece, item as Trap);
      break;
    }
  }
}

function pieceMovedOnTrap(draggedPiece: Piece, trap: Trap) {
  if (!trap.position) {
    // If we entered this condition, something went terribly wrong.
    return;
  }

  move(draggedPiece, trap.position, false);
  draggedPiece.health = 1;
  killPieceByGame(draggedPiece, trap.name);

  game.setItems(game.getItems().filter((item) => item !== trap));
  destroyItemOnBoard(trap);

  game.endMove(false);
}

export function pieceMovedOnPiggyBank(
  draggedPiece: Piece,
  piggyBank: PiggyBank,
) {
  game.setItems(game.getItems().filter((item) => item !== piggyBank));
  destroyItemOnBoard(piggyBank);

  piggyBank.use(draggedPiece.position);
}
