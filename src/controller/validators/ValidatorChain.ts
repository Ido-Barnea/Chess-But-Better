import { IValidator } from './abstract/IValidator';
import { IValidatorChain } from './abstract/IValidatorChain';

export class ValidatorChain implements IValidatorChain {
  private validators: Array<IValidator>;

  constructor(...validators: Array<IValidator>) {
    this.validators = validators;
  }

  validate(): boolean {
    return this.validators.every(validator => validator.validate());
  }
}
