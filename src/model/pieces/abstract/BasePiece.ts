import { Player } from '../../../controller-legacy/logic/players/Player';
import { IPiecesStorage } from '../../../controller/game-state/storages/pieces-storage/abstract/IPiecesStorage';
import { Position } from '../../types/Position';
import { PieceModifiers } from '../PieceModifiers';
import { PieceResource } from '../PieceResource';
import { PieceStats } from '../PieceStats';
import { PieceBehavior } from './PieceBehavior';

export abstract class BasePiece implements PieceBehavior {
  public resource: PieceResource;
  public stats: PieceStats;
  public modifiers: PieceModifiers;
  public player: Player;
  public position: Position | undefined;

  constructor(
    resource: PieceResource,
    stats: PieceStats,
    modifiers: PieceModifiers,
    player: Player,
    position?: Position,
  ) {
    this.resource = resource;
    this.stats = stats;
    this.modifiers = modifiers;
    this.player = player;
    this.position = position;
  }

  abstract getLegalMoves(piecesStorage: IPiecesStorage): Position[];
}
