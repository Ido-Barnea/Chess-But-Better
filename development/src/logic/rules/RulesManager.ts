import { EmptyPocketsRule } from './EmptyPocketsRule';
import { ExperienceOnKillRule } from './ExperienceOnKillRule';
import { FirstBloodRule } from './FirstBloodRule';
import { FriendlyFireRule } from './FriendlyFireRule';
import { PiecesCanFallOffTheBoardRule } from './PiecesCanFallOffTheBoardRule';
import { WithAgeComesWisdomRule } from './WithAgeComesWisdomRule';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inactiveRules = [];
export const activeRules = [
  new PiecesCanFallOffTheBoardRule(),
  new FirstBloodRule(),
  new ExperienceOnKillRule(),
  new FriendlyFireRule(),
  new WithAgeComesWisdomRule(),
  new EmptyPocketsRule(),
];
