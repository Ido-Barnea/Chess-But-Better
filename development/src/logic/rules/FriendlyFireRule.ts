import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 3;
    const description = 'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = game.isFriendlyFire;
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} attacked his own piece and has to pay compensations.`);
      player.gold--;
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}