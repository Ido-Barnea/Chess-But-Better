import React from 'react';

export interface ISquareProps {
  coordinates: { x: number, y: number };
  backgroundColor: string;
}

export const Square: React.FC<ISquareProps> = ({ coordinates, backgroundColor }) => {
  return (
    <div className={`square ${backgroundColor}`} square-id={`${coordinates.x},${coordinates.y}`}></div>
  );
};
