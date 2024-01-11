import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class PiecesCanFallOffTheBoardRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 0;
    const description = 'Pieces can fall off the board.';
    const condition = !!game.fellOffTheBoardPiece;
    const onTrigger = () => {
      Logger.logRule(`
        A ${game.fellOffTheBoardPiece?.player.color} ${game.fellOffTheBoardPiece?.name} fell off the board.
      `);
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}