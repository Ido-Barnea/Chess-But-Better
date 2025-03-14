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
    'pawn-white': {name: Pieces.PAWN, icon: PieceIcon.WHITE_PAWN, resource: PawnResource},
    'pawn-black': {name: Pieces.PAWN, icon: PieceIcon.BLACK_PAWN, resource: PawnResource},
    'knight-white': {name: Pieces.KNIGHT, icon: PieceIcon.WHITE_KNIGHT, resource: KnightResource},
    'knight-black': {name: Pieces.KNIGHT, icon: PieceIcon.BLACK_KNIGHT, resource: KnightResource},
    'bishop-white': {name: Pieces.BISHOP, icon: PieceIcon.WHITE_BISHOP, resource: BishopResource},
    'bishop-black': {name: Pieces.BISHOP, icon: PieceIcon.BLACK_BISHOP, resource: BishopResource},
    'rook-white': {name: Pieces.ROOK, icon: PieceIcon.WHITE_ROOK, resource: RookResource},
    'rook-black': {name: Pieces.ROOK, icon: PieceIcon.BLACK_ROOK, resource: RookResource},
    'queen-white': {name: Pieces.QUEEN, icon: PieceIcon.WHITE_QUEEN, resource: QueenResource},
    'queen-black': {name: Pieces.QUEEN, icon: PieceIcon.BLACK_QUEEN, resource: QueenResource},
    'king-white': {name: Pieces.KING, icon: PieceIcon.WHITE_KING, resource: KingResource},
    'king-black': {name: Pieces.KING, icon: PieceIcon.BLACK_KING, resource: KingResource},
  };

  static getPieceResources(pieceType: PieceType, team: ITeam): PieceResources {
    const key = `${pieceType}-${team.name.toLowerCase()}`;
    const resource = PieceUtilities.pieceResources[key];

    if (!resource) {
      throw new Error(`No resources found for piece ${pieceType} of team ${team.name}`);
    }

    return resource;
  }
}
