import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class FriendlyFireRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 3;
    const description = 'Friendly Fire! Players can attack their own pieces (for a price).';
    const condition = Game.isFriendlyFire;
    const onTrigger = () => {
      const player = Game.getCurrentPlayer();
      Logger.logRule(`${player.color} attacked his own piece and has to pay compensations.`);
      player.gold--;
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}