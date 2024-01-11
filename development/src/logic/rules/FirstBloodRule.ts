import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class FirstBloodRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 1;
    const description = 'First Blood Bonus: The first to kill gets an extra XP.';
    const condition = game.deathCounter == 1;
    const onTrigger = () => {
      const player = game.getCurrentPlayer();
      Logger.logRule(`${player.color} has made First Blood and received a bonus.`);
      player.xp++;
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}