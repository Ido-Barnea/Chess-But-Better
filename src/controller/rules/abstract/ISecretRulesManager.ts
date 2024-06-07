import { BaseRule } from './BaseRule';

export interface ISecretRulesManager {
  getRules(): Array<BaseRule>;
}
