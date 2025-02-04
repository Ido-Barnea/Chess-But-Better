import { EventType } from "./Events";

export type Handler = (context: Record<string, any>) => void;

export class GameEventEmitter {
  private events: { [key: string]: Array<Handler> } = {};

  on(event: EventType, handler: Handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  emit(event: EventType, context: Record<string, any> = {}) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler(context));
    }
  }

  off(event: EventType, handler: Handler) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((h) => h !== handler);
    }
  }
}
