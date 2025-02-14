import { PieceResources } from "../../../model/piece/utilities/PieceResources";
import { ITeam } from "../../../model/player/team/abstract/ITeam";
import { PieceIcon } from "../types/PieceIcons";
import { Pieces, PieceType } from "../types/Pieces";
import KingResource from '../../../assets/images/pieces/base/KingResource.svg?react';
import QueenResource from '../../../assets/images/pieces/base/QueenResource.svg?react';
import RookResource from '../../../assets/images/pieces/base/RookResource.svg?react';
import BishopResource from '../../../assets/images/pieces/base/BishopResource.svg?react';
import KnightResource from '../../../assets/images/pieces/base/KnightResource.svg?react';
import PawnResource from '../../../assets/images/pieces/base/PawnResource.svg?react';

export class PieceUtilities {
  private static pieceResources: Record<string, PieceResources> = {
    'pawn-white': new PieceResources(Pieces.PAWN, PieceIcon.WHITE_PAWN, PawnResource),
    'pawn-black': new PieceResources(Pieces.PAWN, PieceIcon.BLACK_PAWN, PawnResource),
    'knight-white': new PieceResources(Pieces.KNIGHT, PieceIcon.WHITE_KNIGHT, KnightResource),
    'knight-black': new PieceResources(Pieces.KNIGHT, PieceIcon.BLACK_KNIGHT, KnightResource),
    'bishop-white': new PieceResources(Pieces.BISHOP, PieceIcon.WHITE_BISHOP, BishopResource),
    'bishop-black': new PieceResources(Pieces.BISHOP, PieceIcon.BLACK_BISHOP, BishopResource),
    'rook-white': new PieceResources(Pieces.ROOK, PieceIcon.WHITE_ROOK, RookResource),
    'rook-black': new PieceResources(Pieces.ROOK, PieceIcon.BLACK_ROOK, RookResource),
    'queen-white': new PieceResources(Pieces.QUEEN, PieceIcon.WHITE_QUEEN, QueenResource),
    'queen-black': new PieceResources(Pieces.QUEEN, PieceIcon.BLACK_QUEEN, QueenResource),
    'king-white': new PieceResources(Pieces.KING, PieceIcon.WHITE_KING, KingResource),
    'king-black': new PieceResources(Pieces.KING, PieceIcon.BLACK_KING, KingResource),
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
