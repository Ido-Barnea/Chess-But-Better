import { IEventHandler } from "./IEventHandler";

export interface IParentEventHandler extends IEventHandler {
  addHandler(handler: IEventHandler): void;
}
