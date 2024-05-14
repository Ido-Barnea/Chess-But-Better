import { ActionResult } from '../types/ActionResult';

export interface GameAction {
  execute(): ActionResult;
}
