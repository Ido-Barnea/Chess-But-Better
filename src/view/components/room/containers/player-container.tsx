import { Box } from '@mui/material';
import React from 'react';
import { InfoContainer } from '../info container/info-container';
import { ITurnSwitcher } from '../../../../controller/game-state/switchers/turn-switcher/abstract/ITurnSwitcher';
import { IPlayersStorage } from '../../../../controller/game-state/storages/players-storage/abstract/IPlayersStorage';

interface PlayerContainerProps {
  turnSwitcher: ITurnSwitcher;
  playersStorage: IPlayersStorage;
}

export const PlayerContainer: React.FC<PlayerContainerProps> = (props) => {
  return (
    <Box className='player-container'>
      <InfoContainer turnSwitcher={props.turnSwitcher} playersStorage={props.playersStorage} />
      <div className="purchasable-container">
        <p>Shop</p>
        <input type="checkbox" id="shop-upgrade-swapper" />
        <p>Tree</p>
      </div>
      <div id="piece-upgrades-container" className="collapsed center-horizontally"></div>
      <div id="shop-container" className="center-horizontally"></div>
      <div id="inventories-container" className="center-horizontally"></div>
    </Box>
  );
};
