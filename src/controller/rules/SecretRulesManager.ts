import { BaseRule } from './abstract/BaseRule';
import { ISecretRulesManager } from './abstract/ISecretRulesManager';

export class SecretRulesManager implements ISecretRulesManager {
  private inactiveRules: Array<BaseRule>;
  private activeRules: Array<BaseRule>;

  constructor(rules: Array<BaseRule>) {
    this.inactiveRules = rules;
    this.activeRules = this.inactiveRules;
  }

  getRules(): Array<BaseRule> {
    return this.activeRules;
  }
}
