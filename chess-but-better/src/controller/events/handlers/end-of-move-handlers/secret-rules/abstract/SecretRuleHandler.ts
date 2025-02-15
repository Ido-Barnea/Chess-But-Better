import { IEventHandler } from "../../../../abstract/IEventHandler";

export abstract class SecretRuleHandler implements IEventHandler {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  abstract condition(): boolean;
  abstract outcome(): void;

  displayMessage(message: string): void {
    console.log(message);
  }

  handle(): void {
    if (this.condition()) {
      this.displayMessage(this.message);
      this.outcome();
    }
  }
}
