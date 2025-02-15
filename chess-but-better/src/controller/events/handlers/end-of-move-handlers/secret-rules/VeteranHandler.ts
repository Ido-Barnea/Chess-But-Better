import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { SecretRuleHandler } from "./abstract/SecretRuleHandler";

export class VeteranHandler extends SecretRuleHandler {
  constructor() {
    super('Veteran');
  }

  condition(context: Record<string, any>): boolean {
    const killer: BasePiece = context['killer'];
    return !!killer;
  }

  outcome(context: Record<string, any>): void {
    const killer: BasePiece = context['killer'];
    killer.team.experience += 1;
  }
}
