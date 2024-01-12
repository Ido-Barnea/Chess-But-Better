import { game } from './Game';
import { onActionTriggered, onFellOffTheBoardTriggered, renderScreen } from './LogicAdapter';
import { highlightSquare, initializeBoards } from './ui/BoardManager';
import { initializeEventListeners, setOnAction, setOnFellOffTheBoard, setOnHighlight } from './ui/Events';
import { Logger } from './ui/Logger';

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

Logger.logGeneral('Game started!');
