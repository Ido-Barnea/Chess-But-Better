import React from 'react';
import BoardsContainer from './BoardsContainer';

const CenterColumn = () => {
  return (
    <div id="center-column">
      <BoardsContainer />
      <div id="unicorn-attack" className="collapsed ability"></div>
    </div>
  );
};

export default CenterColumn;
