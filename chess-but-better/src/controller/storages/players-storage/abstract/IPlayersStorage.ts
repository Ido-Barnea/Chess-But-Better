import { IPlayer } from "../../../../model/player/abstract/IPlayer";

export interface IPlayersStorage {
  getPlayers(filter?: (player: IPlayer) => boolean): Array<IPlayer>;
  getPlayersCount(): number;
}
