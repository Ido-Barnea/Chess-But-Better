import { Player } from '../Player';

export interface IPlayersStorage {
  getPlayers(filter?: (player: Player) => boolean): Array<Player>;
}
