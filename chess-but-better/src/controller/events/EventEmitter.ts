import { GameEvent } from "./Events";
import { IEventHandler } from "./abstract/IEventHandler";

export class EventEmitter {
  private events: { [key: string]: Array<IEventHandler> } = {};

  on(event: GameEvent, handler: IEventHandler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  emit(event: GameEvent) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler.handle());
    }
  }

  off(event: string, handler: IEventHandler) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((h) => h !== handler);
    }
  }
}
