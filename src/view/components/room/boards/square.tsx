import React, { PropsWithChildren } from 'react';

export interface ISquareProps {
  coordinates: { x: number, y: number };
  backgroundColor: string;
}

export const Square: React.FC<PropsWithChildren<ISquareProps>> = (props) => {
  return (
    <div className={`square ${props.backgroundColor}`} square-id={`${props.coordinates.x},${props.coordinates.y}`}>
      { props.children }
    </div>
  );
};
