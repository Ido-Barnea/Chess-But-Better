import { ICastlingSwitcher } from './abstract/ICastlingSwitcher';

export class CastlingSwitcher implements ICastlingSwitcher {
  private isCastling: boolean;

  constructor() {
    this.isCastling = false;
  }

  getCastlingState(): boolean {
    return this.isCastling;
  }
  switchIsCastling(): void {
    this.isCastling = !this.isCastling;
  }
}
