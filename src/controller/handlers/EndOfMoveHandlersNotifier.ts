import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';
import { IEndOfMoveHandlersNotifier } from './abstract/IEndOfMoveHandlersNotifier';

export class EndOfMoveHandlersNotifier implements IEndOfMoveHandlersNotifier {
  private handlers: Array<IEndOfMoveHandler>;

  constructor() {
    this.handlers = [];
  }

  addHandler(handler: IEndOfMoveHandler): void {
    this.handlers.push(handler);
  }

  notifyHandlers(): void {
    this.handlers.forEach(handler => handler.handle());
  }
}
