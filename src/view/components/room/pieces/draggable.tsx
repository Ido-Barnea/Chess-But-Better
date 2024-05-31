import React, { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd'

interface DraggableProps {
  name: string;
  children: React.ReactElement<HTMLDivElement>;
}

export const Draggable: React.FC<PropsWithChildren<DraggableProps>> = (props) => {
  const [{ isDragging }, draggedElementRef] = useDrag(() => ({
    type: 'piece',
    item: { name: props.name },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [props.name]);

  return React.cloneElement(props.children, {
    ref: draggedElementRef,
    style: {
      opacity: isDragging ? 0.5 : 1,
    },
  });
};
