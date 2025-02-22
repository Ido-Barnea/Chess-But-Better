import { BaseEventHandler } from "../../../../abstract/BaseEventHandler";
export abstract class SecretRuleHandler implements BaseEventHandler {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  abstract condition(context: Record<string, any>): boolean;
  abstract outcome(context: Record<string, any>): void;

  displayMessage(message: string): void {
    console.log(message);
  }

  handle = (context: Record<string, any>): void => {
    if (this.condition(context)) {
      this.displayMessage(this.message);
      this.outcome(context);
    }
  }
}
