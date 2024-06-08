import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd'
import { DraggableType } from './DraggableType';
import { Coordinates } from '../../../../../model/types/Coordinates';

interface DraggableProps {
  type: DraggableType;
  coordinates: Coordinates | undefined;
  isDraggable: () => boolean;
  children: React.ReactElement<HTMLDivElement>;
}

export const Draggable: React.FC<PropsWithChildren<DraggableProps>> = (props) => {
  const [{ isDragging }, draggedElementRef] = useDrag(() => ({
    type: props.type,
    item: { coordinates: props.coordinates },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: props.isDraggable(),
  }), [props.type]);

  const draggableProps = props.isDraggable() ? {
    ref: draggedElementRef,
    style: {
      opacity: isDragging ? 0.5 : 1,
    },
  } : {};

  return React.cloneElement(props.children, draggableProps);
};