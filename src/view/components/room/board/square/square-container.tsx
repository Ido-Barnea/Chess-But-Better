import React, { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { DraggableType } from '../../other/draggable/DraggableType';
import { Coordinates } from '../../../../../model/types/Coordinates';

export interface ISquareContainerProps {
  coordinates: { x: number, y: number };
  backgroundColor: string;
  onPiecePlaced: (startCoordinates: Coordinates | undefined, endCoordinates: Coordinates) => void;
}

export const SquareContainer: React.FC<PropsWithChildren<ISquareContainerProps>> = (props) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableType.PIECE,
    drop: (item: { coordinates: Coordinates | undefined }) => {
      const startCoordinates = item.coordinates;
      props.onPiecePlaced(startCoordinates, props.coordinates);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`square ${props.backgroundColor} ${isOver ? 'highlight-square' : ''}`}
      square-id={`${props.coordinates.x},${props.coordinates.y}`}>
      { props.children }
    </div>
  );
};
