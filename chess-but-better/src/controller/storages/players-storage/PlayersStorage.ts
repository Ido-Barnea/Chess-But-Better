import { Player } from '../../../model/player/Player';
import { IPlayersStorage } from './abstract/IPlayersStorage';

export class PlayersStorage implements IPlayersStorage {
  private players: Array<Player>;

  constructor(players: Array<Player>) {
    this.players = players;
  }

  getPlayers(filter: (player: Player) => boolean = () => true): Array<Player> {
    return this.players.filter(filter);
  }

  getPlayersCount(): number {
    return this.players.length;
  }
}
