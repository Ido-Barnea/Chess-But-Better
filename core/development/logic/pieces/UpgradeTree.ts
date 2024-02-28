import { VOID_BOARD_ID } from '../../Constants';
import { game } from '../../Game';
import { destroyPieceOnBoard, spawnPieceOnBoard } from '../../LogicAdapter';
import { isPlayerAllowedToAct } from '../PieceLogic';
import { Piece } from './Piece';

export class UpgradesTree {
  upgrade(originalPiece: Piece, upgradedToPiece: Piece) {
    const player = originalPiece.player;
    if (isPlayerAllowedToAct(player) && player.xp >= upgradedToPiece.price) {
      player.xp -= upgradedToPiece.price;

      const currentPieces = game.getPieces();
      const updatedPieces = currentPieces.filter(
        (piece) => piece !== originalPiece,
      );
      upgradedToPiece.position = originalPiece.copyPosition();
      upgradedToPiece.player = originalPiece.player;
      updatedPieces.push(upgradedToPiece);

      game.setPieces(updatedPieces);

      originalPiece.position.boardId = VOID_BOARD_ID;
      destroyPieceOnBoard(originalPiece);
      spawnPieceOnBoard(upgradedToPiece);
    }
  }
}
