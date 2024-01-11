import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
import { BaseRule } from './BaseRule';

export class WithAgeComesWisdomRule extends BaseRule {
  constructor(game: Game, isRevealed = false) {
    const index = 4;
    const description = 'With age comes wisdom.';
    const condition = game.roundCounter === 20;
    const onTrigger = () => {
      Logger.logRule('Children of war, you have grown old. Each player gains five XP.');
      game.players.forEach((player) => {
        Logger.logGeneral(`${player.color} gained XP.`);
        player.xp += 5;
      });
    };

    super(game, index, description, isRevealed, condition, onTrigger);
  }
}