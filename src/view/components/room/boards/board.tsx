import React from 'react';
import { ISquareProps, Square } from './board-square';

interface IBoardsProps {
  boardId: string;
  lightSquareColor: string;
  darkSquareColor: string;
  isCollapsed?: boolean;
  size?: number;
}

const calculateSquareBackgroundColorByCoordinates = (
  coordinates: { x: number, y: number },
  lightSquareColor: string,
  darkSquareColor: string,
) => {
  const isEvenColumn = coordinates.x % 2 === 0;
  const isEvenRow = coordinates.y % 2 === 0;

  if (isEvenRow) {
    return isEvenColumn ? lightSquareColor : darkSquareColor;
  } else {
    return isEvenColumn ? darkSquareColor : lightSquareColor;
  }
};

const generateSquares = (
  size: number,
  lightSquareColor: string,
  darkSquareColor: string,
): Array<ISquareProps> => {
  const squares: Array<ISquareProps> = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const coordinates = { x, y };
      const backgroundColor = calculateSquareBackgroundColorByCoordinates(
        coordinates,
        lightSquareColor,
        darkSquareColor,
      );

      squares.push({
        coordinates: coordinates,
        backgroundColor: backgroundColor,
      });
    }
  }

  return squares;
};

export const Board: React.FC<IBoardsProps> = ({ boardId, lightSquareColor, darkSquareColor, isCollapsed=true, size=8 }) => {
  return (
    <div className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}>
      {
        generateSquares(size, lightSquareColor, darkSquareColor).map(square => {
          return <Square coordinates={ square.coordinates } backgroundColor={ square.backgroundColor } />;
        })
      }
    </div>
  );
};
