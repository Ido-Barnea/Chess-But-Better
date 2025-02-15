import { isEqual } from "lodash";
import { BasePiece } from "../../../../../model/piece/abstract/BasePiece";
import { IPiecesStorage } from "../../../../storages/pieces-storage/abstract/IPiecesStorage";
import { SecretRuleHandler } from "./abstract/SecretRuleHandler";

export class VeteranHandler extends SecretRuleHandler {
  private piecesStorage: IPiecesStorage;
  private previousKiller: BasePiece | undefined;

  constructor(piecesStorage: IPiecesStorage) {
    super('Veteran');
    this.piecesStorage = piecesStorage;
    this.previousKiller = undefined;
  }

  getKillerPieces(): Array<BasePiece> {
    return this.piecesStorage.getPieces((p) => p.stats.kills > 0 && !isEqual(p, this.previousKiller));
  }

  condition(): boolean {
    const killerPieces = this.getKillerPieces();
    return killerPieces.length > 0;
  }

  outcome(): void {
    this.previousKiller = this.getKillerPieces()[0];
    this.previousKiller.team.experience += 1;
  }
}
