import { BOARD_WIDTH } from '../Constants';
import { IEditablePiecesStorage } from '../game state/storages/pieces storage/abstract/IEditablePiecesStorage';
import { Pawn } from '../pieces/Pawn';
import { Queen } from '../pieces/Queen';
import { PlayerColor } from '../game state/storages/players storage/types/PlayerColor';
import { IEndOfMoveHandler } from './abstract/IEndOfMoveHandler';

export class PawnPromotionHandler implements IEndOfMoveHandler {
  constructor(private piecesStorage: IEditablePiecesStorage) {}

  handle(): void {
    const pieces = this.piecesStorage.getPieces();

    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (piece instanceof Pawn && piece.position) {
        const whitePawnReachedEndOfBoard = piece.player.color === PlayerColor.WHITE && piece.position.coordinates.y === 0;
        const blackPawnReachedEndOfBoard =
          piece.player.color === PlayerColor.BLACK &&
          piece.position.coordinates.y === BOARD_WIDTH - 1;
  
        if (whitePawnReachedEndOfBoard || blackPawnReachedEndOfBoard) {
          const newQueen = new Queen(piece.player, piece.position);
          
          this.piecesStorage.removePiece(piece)
          this.piecesStorage.addPiece(newQueen);
        }
      }
    }
  }
}
