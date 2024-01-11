import { renderRules } from '../../LogicAdapter';
import { Logger } from '../../ui/Logger';
import { Game } from '../GameController';
export interface Rule {
  id: number;
  description: string;
  isRevealed: boolean;
  condition: boolean;
  onTrigger: () => void;
  trigger: () => void;
}

export class BaseRule implements Rule {
  game: Game;
  id: number;
  description: string;
  isRevealed: boolean;
  condition: boolean;
  onTrigger: () => void;

  constructor(
    game: Game,
    id: number,
    description: string,
    isRevealed: boolean,
    condition: boolean,
    onTrigger: () => void,
  ) {
    this.game = game;
    this.id = id;
    this.description = description;
    this.isRevealed = isRevealed;
    this.condition = condition;
    this.onTrigger = onTrigger;
  }

  trigger() {
    if (this.condition) {
      this.onTrigger();
      if (!this.isRevealed) {
        const player = this.game.getCurrentPlayer();
        Logger.logRule(`${player.color} received XP for revealing a new rule: ${this.description}`);
        player.xp++;
        this.isRevealed = true;

        renderRules(this);
      }
    }
  }
}