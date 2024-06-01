import { BasePiece } from '../../../../../model/pieces/abstract/BasePiece';
import { Square } from '../../../../../model/types/Square';

export const generateSquares = (
  size: number,
  boardId: string,
  pieces: Array<BasePiece>,
): Array<Square> => {
  const squares: Array<Square> = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const coordinates = { x, y };
      const piece = pieces?.find(p => p.position?.coordinates.x === x && p.position?.coordinates.y === y);

      squares.push({
        position: { coordinates: coordinates, boardId: boardId },
        occupant: piece,
      });
    }
  }

  return squares;
};
