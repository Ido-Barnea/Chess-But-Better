import React from 'react';
import './../styles/pages/room.css';
import LeftColumn from '../components/room/LeftColumn';
import CenterColumn from '../components/room/CenterColumn';
import RightColumn from '../components/room/RightColumn';

const Room = () => {
  return (
    <div>
      <LeftColumn />
      <CenterColumn />
      <RightColumn />
    </div>
  );
};

export default Room;
