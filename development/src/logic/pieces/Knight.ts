import { knightResource } from '../../ui/Resources';
import { Piece } from './Pieces';
import { Player, PlayerColors } from '../Players';
import { Position, Square } from './PiecesHelpers';
import { Game } from '../GameController';

export class Knight extends Piece {
  constructor(game: Game, position: Position, player: Player) {
    const logo = player.color === PlayerColors.WHITE
      ? '♘'
      : '♞';
    super(game, position, player, knightResource, 'Knight', logo);
  }

  validateMove(target: Piece | Square): Position {
    const targetCoordinates = target.position.coordinates;
    const currentCoordinates = this.position.coordinates;
    const absDeltaX = Math.abs(targetCoordinates[0] - currentCoordinates[0]);
    const absDeltaY = Math.abs(targetCoordinates[1] - currentCoordinates[1]);

    // Knights can move two squares in any direction and one square to the side.
    return absDeltaY * absDeltaX === 2 ? target.position : this.position;
  }
}