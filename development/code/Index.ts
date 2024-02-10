import { game } from './Game';
import { onActionTriggered, onFellOffTheBoardTriggered, renderScreen } from './LogicAdapter';
import { highlightSquare, initializeBoards } from './ui/BoardManager';
import { initializeEventListeners, setOnAction, setOnFellOffTheBoard, setOnHighlight } from './ui/Events';
import { Log } from './ui/logger/Log';
import { Logger } from './ui/logger/Logger';

function setGameEventHandlers() {
  setOnAction(onActionTriggered);
  setOnFellOffTheBoard(onFellOffTheBoardTriggered);
  setOnHighlight(highlightSquare);
}

function initializeUI() {
  initializeBoards();
  initializeEventListeners();
  renderScreen();
  setGameEventHandlers();
}

initializeUI();
game.initialize();

new Log('Game started!').addToQueue();
Logger.logMessages();
