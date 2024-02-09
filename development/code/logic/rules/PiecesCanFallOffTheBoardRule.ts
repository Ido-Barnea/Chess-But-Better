import { game } from '../../Game';
import { Logger } from '../../ui/Logger';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(isRevealed = false) {
    const description = 'Pieces can fall off the board.';
    const condition = () => !!game.getFellOffTheBoardPiece();
    const onTrigger = () => {
      const fellOffTheBoard = game.getFellOffTheBoardPiece()?.name;
      Logger.logRule(`
        A ${game.getFellOffTheBoardPiece()?.player.color} ${fellOffTheBoard} fell off the board.
      `);
    };

    super(description, isRevealed, condition, onTrigger);
  }
}
