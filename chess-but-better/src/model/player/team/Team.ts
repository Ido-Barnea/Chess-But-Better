import { TeamType } from "./TeamTypes";
import { ITeam } from "./abstract/ITeam";

export class Team implements ITeam {
  name: TeamType;
  gold: number;
  experience: number;

  constructor(name: TeamType) {
    this.name = name;
    this.gold = 0;
    this.experience = 0;
  }
}
