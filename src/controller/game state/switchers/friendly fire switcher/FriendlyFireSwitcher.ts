import { IFriendlyFireSwitcher } from './abstract/IFriendlyFireSwitcher';

export class FriendlyFireSwitcher implements IFriendlyFireSwitcher {
  private isFriendlyFire: boolean;

  constructor() {
    this.isFriendlyFire = false;
  }

  getFriendlyFireState(): boolean {
    return this.isFriendlyFire;
  }
  switchIsFriendlyFire(): void {
    this.isFriendlyFire = !this.isFriendlyFire;
  }
}
