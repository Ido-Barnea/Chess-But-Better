import { isEqual } from "lodash";
import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { SecretRuleHandler } from "./abstract/SecretRuleHandler";

export class FriendlyFireHandler extends SecretRuleHandler {
  constructor() {
    super('Friendly Fire');
  }

  isFriendlyFire(killer: BasePiece, victim: BasePiece): boolean {
    return isEqual(killer.team, victim.team);
  }

  condition(context: Record<string, any>): boolean {
    const killer: BasePiece = context['killer'];
    const victim: BasePiece = context['victim'];
    return !!killer && !!victim && this.isFriendlyFire(killer, victim);
  }

  outcome(context: Record<string, any>): void {
    const killer: BasePiece = context['killer'];

    killer.team.gold -= 1;
  }
}
