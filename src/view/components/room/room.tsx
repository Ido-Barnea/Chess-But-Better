import React from 'react';
import '../../styles/pages/room.css';
import { LeftColumn } from './columns/left-column';
import { CenterColumn } from './columns/center-column';
import { RightColumn } from './columns/right-column';

export const Room = () => {
  return (
    <div>
      <LeftColumn />
      <CenterColumn />
      <RightColumn />
    </div>
  );
};
