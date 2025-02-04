import { EventType } from "./Events";

export class EventEmitter {
  private events: { [key: string]: Array<() => void> } = {};

  on(event: EventType, handler: () => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  emit(event: EventType) {
    if (this.events[event]) {
      this.events[event].forEach((handler) => handler());
    }
  }

  off(event: string, handler: () => void) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((h) => h !== handler);
    }
  }
}
