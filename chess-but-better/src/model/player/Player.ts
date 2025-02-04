import { IPlayer } from "./abstract/IPlayer";
import { ITeam } from "./team/abstract/ITeam";

export class Player implements IPlayer {
  name: string;
  team: ITeam;
  
  constructor(name: string, team: ITeam) {
    this.name = name;
    this.team = team;
  }
}
