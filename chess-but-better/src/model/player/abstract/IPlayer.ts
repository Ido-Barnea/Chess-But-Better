import { ITeam } from "../team/abstract/ITeam";

export interface IPlayer {
  name: string;
  team: ITeam;
}