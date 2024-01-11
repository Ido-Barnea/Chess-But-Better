import { Game } from '../GameController';
import { BaseRule } from './BaseRule';
import { EmptyPocketsRule } from './EmptyPocketsRule';
import { ExperienceOnKillRule } from './ExperienceOnKillRule';
import { FirstBloodRule } from './FirstBloodRule';
import { FriendlyFireRule } from './FriendlyFireRule';
import { PiecesCanFallOffTheBoardRule } from './PiecesCanFallOffTheBoardRule';
import { WithAgeComesWisdomRule } from './WithAgeComesWisdomRule';

export class RulesManager {
  inactiveRules: Array<BaseRule>;
  activeRules: Array<BaseRule>;

  constructor(game: Game) {
    this.inactiveRules = [];
    this.activeRules = [
      new PiecesCanFallOffTheBoardRule(game),
      new FirstBloodRule(game),
      new ExperienceOnKillRule(game),
      new FriendlyFireRule(game),
      new WithAgeComesWisdomRule(game),
      new EmptyPocketsRule(game),
    ];
  }
}
