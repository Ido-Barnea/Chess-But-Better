import { IPlayersStorage } from './abstract/IPlayersStorage';
import { Player } from './Player';

export class PlayersStorage implements IPlayersStorage {
  private players: Array<Player>;

  constructor(players: Array<Player>) {
    this.players = players;
  }

  getPlayers(filter: (player: Player) => boolean = () => true): Array<Player> {
    return this.players.filter(filter);
  }
}
