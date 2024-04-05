import { game } from '../Game';
import {
  destroyPieceOnBoard,
  movePieceOnBoard,
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
import { BaseItem } from './items/abstract/Item';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Player } from './players/Player';
import { KillLog, Log, MovementLog } from '../ui/logs/Log';
import { BasePiece } from './pieces/abstract/BasePiece';
import { Square } from './pieces/types/Square';
import { Position } from './pieces/types/Position';
import { PlayerMoveValidator } from './validators/PlayerMoveValidator';
import { PieceMovementSimulationValidator } from './validators/PieceMovementSimulationValidator';
import { PieceSpawningAction } from './actions/PieceSpawningAction';
import { PieceFellOffTheBoardAction } from './actions/PieceFellOffTheBoardAction';

function revertPieceMoveOnBoard(piece: BasePiece) {
  if (!piece.position) return;
  movePieceOnBoard(piece, piece.position);
}

export function onPieceFellOffTheBoard(draggedPiece: BasePiece) {
  new PieceFellOffTheBoardAction(draggedPiece).execute()
}

export function onPlayerAction(
  draggedPiece: BasePiece,
  target: BasePiece | Square | BaseItem,
) {
  const playerMoveValidator = new PlayerMoveValidator(draggedPiece, target);
  if (!playerMoveValidator.validate() || !target.position) {
    revertPieceMoveOnBoard(draggedPiece);
    return;
  }

  if (game.getMovesLeft() === 0) {
    game.setMovesLeft(draggedPiece.moves);
  }

  const pieceMovementSimulationValidator = new PieceMovementSimulationValidator(
    draggedPiece,
    target.position,
  );
  if (!pieceMovementSimulationValidator.validate()) return;

  if (target instanceof BasePiece) {
    onActionAttackMove(draggedPiece, target);
  } else {
    const targetSquare =
      target instanceof BaseItem
        ? { position: target.position }
        : (target as Square);

    onActionNonAttackMove(draggedPiece, targetSquare);
  }
}

function onActionAttackMove(draggedPiece: BasePiece, targetPiece: BasePiece) {
  if (!targetPiece.position) return;
  game.setIsFriendlyFire(targetPiece.player === draggedPiece.player);
  const isSuccessfulKill = killPieceByAnotherPiece(targetPiece, draggedPiece);
  if (!isSuccessfulKill) return;

  const targetSquare: Square = { position: targetPiece.position };
  move(draggedPiece, targetSquare.position);
}

function onActionNonAttackMove(draggedPiece: BasePiece, targetSquare: Square) {
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
  if (!kingPiece.position) return;
  const targetXPosition = targetSquare.position.coordinates[0];
  const kingXPosition = kingPiece.position.coordinates[0];
  const deltaX = targetXPosition - kingXPosition;
  const isKingsideCastling = deltaX > 0;

  const rookPiece = kingPiece.getRookForCastling(
    kingPiece.player,
    isKingsideCastling,
  );
  if (!rookPiece || !rookPiece.position) return false;

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
  return player === game.getPlayersTurnSwitcher().getCurrentPlayer();
}

export function move(
  draggedPiece: BasePiece,
  targetPosition: Position,
  shouldEndTurn = true,
) {
  new MovementLog(draggedPiece, targetPosition).addToQueue();
  movePieceOnBoard(draggedPiece, targetPosition);
  if (!draggedPiece.position) return;

  draggedPiece.position = {
    coordinates: targetPosition.coordinates,
    boardId: draggedPiece.position.boardId,
  };

  draggedPiece.hasMoved = true;
  if (shouldEndTurn) game.endMove();
}

function failToKillPiece(draggedPiece: BasePiece, targetPiece: BasePiece) {
  if (!targetPiece.position || !draggedPiece.position) return;
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
  targetPiece: BasePiece,
  draggedPiece: BasePiece,
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
  game.setKillerPiece(draggedPiece);
  new KillLog(targetPiece, draggedPiece).addToQueue();
  return true;
}

export function killPieceByGame(targetPiece: BasePiece, killCause: string) {
  killPiece(targetPiece);
  new KillLog(targetPiece, killCause).addToQueue();
}

function killPiece(targetPiece: BasePiece) {
  const originBoardId = targetPiece.position?.boardId;

  if (targetPiece.position?.boardId === OVERWORLD_BOARD_ID) {
    handleOverworldKill(targetPiece);
  } else {
    permanentlyKillPiece(targetPiece);
  }

  game.increaseDeathCounter();
  destroyPieceOnBoard(targetPiece, originBoardId);
  return true;
}

export function handleOverworldKill(targetPiece: BasePiece) {
  if (!targetPiece || !targetPiece.position) return;
  destroyPieceOnBoard(targetPiece);

  if (targetPiece.killCount > 0 || targetPiece instanceof King) {
    targetPiece.position.boardId = HELL_BOARD_ID;
  } else {
    targetPiece.position.boardId = HEAVEN_BOARD_ID;
  }

  targetPiece.killCount = 0;
  new PieceSpawningAction(targetPiece).execute();
}

export function permanentlyKillPiece(targetPiece: BasePiece) {
  if (!targetPiece.position) return;
  game.increaseDeathCounter();

  targetPiece.position.boardId = VOID_BOARD_ID;
  game.setPieces(game.getPieces().filter((piece) => piece !== targetPiece));

  if (targetPiece instanceof King) endGame();
}
