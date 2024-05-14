import { game } from '../Game';
import { movePieceOnBoard } from '../LogicAdapter';
import { BaseItem } from './items/abstract/Item';
import { Player } from './players/Player';
import { MovementLog } from '../ui/logs/Log';
import { PlayerMoveValidator } from './validators/PlayerMoveValidator';
import { PieceMovementSimulationValidator } from './validators/PieceMovementSimulationValidator';
import { AttackPieceAction } from './actions/AttackPieceAction';
import { MovePieceAction } from './actions/MovePieceAction';
import { RevertPieceMovementAction } from './actions/RevertPieceMovementAction';
import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { Square } from '../../model/types/Square';
import { Position } from '../../model/types/Position';

export function onPlayerAction(
  draggedPiece: BasePiece,
  target: BasePiece | Square | BaseItem,
) {
  const playerMoveValidator = new PlayerMoveValidator(draggedPiece, target);
  if (!playerMoveValidator.validate() || !target.position) {
    new RevertPieceMovementAction(draggedPiece).execute();
    return;
  }

  if (game.getMovesLeft() === 0) {
    game.setMovesLeft(draggedPiece.stats.moves);
  }

  const pieceMovementSimulationValidator = new PieceMovementSimulationValidator(
    draggedPiece,
    target.position,
  );
  if (!pieceMovementSimulationValidator.validate()) return;

  if (target instanceof BasePiece) {
    new AttackPieceAction(draggedPiece, target).execute();
  } else {
    const targetSquare =
      target instanceof BaseItem
        ? { position: target.position }
        : (target as Square);

    new MovePieceAction(draggedPiece, targetSquare.position).execute();
  }
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

  draggedPiece.modifiers.hasMoved = true;
  if (shouldEndTurn) game.endMove();
}
