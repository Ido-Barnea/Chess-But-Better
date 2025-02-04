
export interface IEventHandler {
  handle(context: Record<string, any>): void;
}
