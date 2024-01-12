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

  constructor() {
    this.inactiveRules = [];
    this.activeRules = [
      new PiecesCanFallOffTheBoardRule(),
      new FirstBloodRule(),
      new ExperienceOnKillRule(),
      new FriendlyFireRule(),
      new WithAgeComesWisdomRule(),
      new EmptyPocketsRule(),
    ];
  }
}
