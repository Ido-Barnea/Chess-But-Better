import { IEventHandler } from "../abstract/IEventHandler";
import { IParentEventHandler } from "../abstract/IParentEventHandler";

export class EndOfMoveEventHandler implements IParentEventHandler {
  private handlers: Array<IEventHandler>;

  constructor() {
    this.handlers = [];
  }

  addHandler(handler: IEventHandler): void {
    this.handlers.push(handler);  
  }

  handle(): void {
    this.handlers.forEach(handler => handler.handle());
  }
}
