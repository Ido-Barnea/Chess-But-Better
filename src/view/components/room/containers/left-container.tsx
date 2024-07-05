import { Box } from '@mui/material';
import React from 'react';
import { InfoContainer } from '../info container/info-container';
import { ITurnSwitcher } from '../../../../controller/game state/switchers/turn switcher/abstract/ITurnSwitcher';

interface LeftContainerProps {
  turnSwitcher: ITurnSwitcher;
}

export const LeftContainer: React.FC<LeftContainerProps> = (props) => {
  return (
    <Box className="left-container">
      <InfoContainer turnSwitcher={props.turnSwitcher} />
      <div className="purchasable-container">
        <p>Shop</p>
        <input type="checkbox" id="shop-upgrade-swapper" />
        <p>Tree</p>
      </div>
      <div
        id="piece-upgrades-container"
        className="collapsed center-horizontally"
      ></div>
      <div id="shop-container" className="center-horizontally"></div>
      <div id="inventories-container" className="center-horizontally"></div>
    </Box>
  );
};
