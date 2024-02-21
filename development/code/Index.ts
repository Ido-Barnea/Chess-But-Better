import { game } from './Game';
import {
  onActionTriggered,
  onFellOffTheBoardTriggered,
  renderScreen,
} from './LogicAdapter';
import { initializeBoards } from './ui/BoardManager';
import {
  initializeEventListeners,
  setOnAction,
  setOnFellOffTheBoard,
} from './ui/Events';
import { initializeShopUI } from './ui/ShopUI';
import { Log } from './ui/logs/Log';
import { Logger } from './ui/logs/Logger';

function setGameEventHandlers() {
  setOnAction(onActionTriggered);
  setOnFellOffTheBoard(onFellOffTheBoardTriggered);
}

function initializeUI() {
  initializeBoards();
  initializeShopUI();
  initializeEventListeners();
  renderScreen();
  setGameEventHandlers();
}

initializeUI();
game.initialize();

new Log('Game started!').addToQueue();
Logger.logMessages();
