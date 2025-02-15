import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../../storages/pieces-storage/abstract/IPiecesStorage";
import { SecretRuleHandler } from "./abstract/SecretRuleHandler";

export class FirstBloodHandler extends SecretRuleHandler {
  private piecesStorage: IPiecesStorage;
  private killer: BasePiece | undefined;

  constructor(piecesStorage: IPiecesStorage) {
    super('First Blood');
    this.piecesStorage = piecesStorage;
    this.killer = undefined;
  }

  getKillerPieces(): Array<BasePiece> {
    return this.piecesStorage.getPieces((p) => p.stats.kills > 0);
  }

  condition(): boolean {
    if (this.killer !== undefined) return false;

    const killerPieces = this.getKillerPieces();
    return killerPieces.length > 0 ? true : false;
  }

  outcome(): void {
    this.killer = this.getKillerPieces()[0];
    this.killer.team.experience += 1;
  }
}
