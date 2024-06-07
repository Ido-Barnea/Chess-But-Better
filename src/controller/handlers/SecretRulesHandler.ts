import { ISecretRulesManager } from '../rules/abstract/ISecretRulesManager';
import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';

export class RulesManagerHandler implements IEndOfMoveHandler {
  constructor(private secretRulesManager: ISecretRulesManager) {}

  handle(): void {
    this.secretRulesManager.getRules().forEach((rule) => {
      rule.trigger();
    });
  }
}
