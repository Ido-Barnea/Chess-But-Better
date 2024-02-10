import { game } from '../../Game';
import { KillLog } from '../../ui/logger/Log';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Pieces can fall off the board.';
    const condition = () => !!game.getFellOffTheBoardPiece();
    const onTrigger = () => {
      const fellOffTheBoard = game.getFellOffTheBoardPiece();
      if (!fellOffTheBoard) return;

      new KillLog(fellOffTheBoard, 'gravity').addToQueue();
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
