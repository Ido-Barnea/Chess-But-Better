import React from 'react';

interface IBoardsProps {
  boardId: string;
  isCollapsed: boolean;
}

export const Board: React.FC<IBoardsProps> = ({ boardId, isCollapsed=true }) => {
  return (
    <div className={`board ${isCollapsed ? 'collapsed' : ''}`} id={boardId}></div>
  );
};
