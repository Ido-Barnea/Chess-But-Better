import { SecretRuleHandler } from "./abstract/SecretRuleHandler";
import { IPlayersStorage } from "../../../../storages/players-storage/abstract/IPlayersStorage";
import { Team } from "../../../../../model/player/team/Team";

export class BeggersHandler extends SecretRuleHandler {
  private playersStorage: IPlayersStorage;

  constructor(playersStorage: IPlayersStorage) {
    super('Beggers');
    this.playersStorage = playersStorage;
  }

  getTeamsInDebt = (): Array<Team> => {
    const teamsInDebt = new Set<Team>();
  
    this.playersStorage.getPlayers().forEach((player) => {
      if (player.team.gold < 0) {
        teamsInDebt.add(player.team);
      }
    });
  
    return Array.from(teamsInDebt);
  };
  

  condition(): boolean {
    const teamsInDebt = this.getTeamsInDebt();
    return teamsInDebt.length > 0;
  }

  outcome(): void {
    const teamsInDebt = this.getTeamsInDebt();
    teamsInDebt.forEach((team) => {
      team.experience -= 1;
    });
  }
}
