import { IEndOfMoveHandler } from './IEndOfMoveHandler';

export interface IEndOfMoveHandlersNotifier {
  addHandler(handler: IEndOfMoveHandler): void;
  notifyHandlers(): void;
}
