import { Logger } from '../../ui/Logger';
import { Game } from '../Game';
import { BaseRule } from './BaseRule';

export class WithAgeComesWisdomRule extends BaseRule {
  constructor(isRevealed = false) {
    const index = 4;
    const description = 'With age comes wisdom.';
    const condition = Game.roundCounter === 20;
    const onTrigger = () => {
      Logger.logRule('Children of war, you have grown old. Each player gains five XP.');
      Game.players.forEach((player) => {
        Logger.logGeneral(`${player.color} gained XP.`);
        player.xp += 5;
      });
    };

    super(index, description, isRevealed, condition, onTrigger);
  }
}