import { IPiecesStorage } from "../../../controller/storages/pieces-storage/abstract/IPiecesStorage";
import { ITeam } from "../../player/team/abstract/ITeam";
import { PieceHealth } from "../utilities/PieceHealth";
import { PieceResources } from "../utilities/PieceResources";
import { PieceStats } from "../utilities/PieceStats";
import { Position } from "../utilities/position/Position";
import { PieceBehavior } from "./PieceBehavior";

export abstract class BasePiece implements PieceBehavior {
  resource: PieceResources;
  team: ITeam;
  position: Position;
  health: PieceHealth;
  stats: PieceStats;

  constructor(resource: PieceResources, team: ITeam, position: Position, health: PieceHealth) {
    this.resource = resource;
    this.team = team;
    this.position = position;
    this.health = health;
    this.stats = new PieceStats();
  }

  abstract getLegalMoves(piecesStorage: IPiecesStorage): Array<Position>;
}
