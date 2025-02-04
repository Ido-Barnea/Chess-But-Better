import { IEventHandler } from "./IEventHandler";

export abstract class BaseEventHandler implements IEventHandler {
    constructor() {
        this.handle = this.handle.bind(this);
    }

    abstract handle(context: Record<string, any>): void;
}
