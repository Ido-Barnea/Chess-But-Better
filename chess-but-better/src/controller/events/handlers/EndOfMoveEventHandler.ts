import { BaseEventHandler } from "../abstract/BaseEventHandler";
import { IEventHandler } from "../abstract/IEventHandler";
import { IParentEventHandler } from "../abstract/IParentEventHandler";

export class EndOfMoveEventHandler extends BaseEventHandler implements IParentEventHandler {
  private handlers: Array<IEventHandler>;

  constructor() {
    super();
    this.handlers = [];
  }

  addHandler(handler: IEventHandler): void {
    this.handlers.push(handler);  
  }

  handle(context: Record<string, any>): void {
    this.handlers.forEach(handler => handler.handle(context));
  }
}
