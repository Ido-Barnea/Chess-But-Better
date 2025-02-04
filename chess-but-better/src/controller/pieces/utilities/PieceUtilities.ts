import { PieceResources } from "../../../model/piece/utilities/PieceResources";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { BishopResource, KingResource, KnightResource, PawnResource, QueenResource, RookResource } from "../../../utility/Resources";
import { PieceIcon } from "../types/PieceIcons";
import { PieceType } from "../types/Pieces";

export class PieceUtilities {
  private static pieceResources: Record<string, PieceResources> = {
    'pawn-white': new PieceResources('White Pawn', PieceIcon.WHITE_PAWN, PawnResource),
    'pawn-black': new PieceResources('Black Pawn', PieceIcon.BLACK_PAWN, PawnResource),
    'knight-white': new PieceResources('White Knight', PieceIcon.WHITE_KNIGHT, KnightResource),
    'knight-black': new PieceResources('Black Knight', PieceIcon.BLACK_KNIGHT, KnightResource),
    'bishop-white': new PieceResources('White Bishop', PieceIcon.WHITE_BISHOP, BishopResource),
    'bishop-black': new PieceResources('Black Bishop', PieceIcon.BLACK_BISHOP, BishopResource),
    'rook-white': new PieceResources('White Rook', PieceIcon.WHITE_ROOK, RookResource),
    'rook-black': new PieceResources('Black Rook', PieceIcon.BLACK_ROOK, RookResource),
    'queen-white': new PieceResources('White Queen', PieceIcon.WHITE_QUEEN, QueenResource),
    'queen-black': new PieceResources('Black Queen', PieceIcon.BLACK_QUEEN, QueenResource),
    'king-white': new PieceResources('White King', PieceIcon.WHITE_KING, KingResource),
    'king-black': new PieceResources('Black King', PieceIcon.BLACK_KING, KingResource),
  };

  static getPieceResources(pieceType: PieceType, team: ITeam) {
    const key = `${pieceType}-${team.name.toLowerCase()}`;
    const resource = PieceUtilities.pieceResources[key];

    if (!resource) {
      throw new Error(`No resources found for piece ${pieceType} of team ${team.name}`);
    }

    return resource;
  }
}
