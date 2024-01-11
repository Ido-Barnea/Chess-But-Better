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
import { Game } from './logic/GameController';

function initializeGame() {
  Logger.logGeneral('Game started!');

  const game = new Game();

  initializeBoards(game);
  initializeEventListeners(game);
  renderPlayersInformation(game);

  setGameEventHandlers();
}

function setGameEventHandlers() {
  setOnAction(onActionTriggered);
  setOnFellOffTheBoard(onFellOffTheBoardTriggered);
  setOnHighlight(highlightSquare);
}

initializeGame();
