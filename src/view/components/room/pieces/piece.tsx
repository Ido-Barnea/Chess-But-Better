import React from 'react';

export interface IPieceProps {
  name: string;
  resource: string;
  color: string;
}

export const Piece: React.FC<IPieceProps> = ({ name, resource, color }) => {
  const svgMarkup = { __html: resource };
  return (
    <div className={`piece ${color}`} draggable="true" id={name} dangerouslySetInnerHTML={svgMarkup}></div>

    // TODO: Listen for drag & click events
  );
};
