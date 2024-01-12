import { Logger } from './ui/Logger';
import {
  initializeEventListeners,
  setOnAction,
  setOnFellOffTheBoard,
  setOnHighlight,
} from './ui/Events';
import { highlightSquare, initializeBoards } from './ui/BoardManager';
import { onActionTriggered, onFellOffTheBoardTriggered } from './LogicAdapter';
import { renderPlayersInformation } from './ui/Screen';

function setGameEventHandlers() {
  setOnAction(onActionTriggered);
  setOnFellOffTheBoard(onFellOffTheBoardTriggered);
  setOnHighlight(highlightSquare);
}

export function initializeGame() {
  Logger.logGeneral('Game started!');

  initializeBoards();
  initializeEventListeners();
  renderPlayersInformation();

  setGameEventHandlers();
}

initializeGame();

console.log('GameController.ts loaded.');

