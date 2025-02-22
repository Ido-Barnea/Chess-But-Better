import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { SecretRuleHandler } from "./abstract/SecretRuleHandler";

export class FirstBloodHandler extends SecretRuleHandler {
  private wasClaimed: boolean;

  constructor() {
    super('First Blood');
    this.wasClaimed = false;
  }

  condition(context: Record<string, any>): boolean {
    const killer: BasePiece = context['killer'];
    return !this.wasClaimed && !!killer;
  }

  outcome(context: Record<string, any>): void {
    const killer: BasePiece = context['killer'];
    killer.team.experience += 1;

    this.wasClaimed = true;
  }
}
