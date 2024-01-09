import { Logger } from './ui/Logger';
import {
  initializeEventListeners,
  setOnAction,
  setOnFallOffTheBoard,
  setOnHighlight,
} from './ui/Events';
import { highlightSquare, initializeBoards } from './ui/BoardManager';
import {
  onAction,
  onFallOffTheBoard,
  getCurrentPlayer,
  players,
  roundCounter,
} from './logic/Logic';
import { BaseRule } from './logic/rules/BaseRule';

const infoDisplay = document.getElementById('info-display');
const rulesContainer = document.getElementById('rules-container');

export function updatePlayersInformation() {
  if (infoDisplay) infoDisplay.textContent = '';

  const roundElement = document.createElement('p');
  roundElement.innerHTML = `Round: ${roundCounter}`;
  infoDisplay?.appendChild(roundElement);

  const playersElement = document.createElement('p');
  playersElement.innerHTML = 'Players:';

  players.forEach((player) => {
    const playerInformationElement = document.createElement('div');

    const statusElement = document.createElement('p');
    const isCurrentPlayer = getCurrentPlayer() === player;
    const title = `${isCurrentPlayer ? '> ' : ''} ${player.color} Player:`;
    const status = `${title} ${player.xp} XP; ${player.gold} Gold.`;
    statusElement.innerHTML = status;

    const inventoryElement = player.inventory.toHTMLElement();

    playerInformationElement.appendChild(statusElement);
    playerInformationElement.appendChild(inventoryElement);

    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay?.appendChild(playersElement);
}

export function updateRules(rule: BaseRule) {
  const ruleElement = document.createElement('p');
  ruleElement.innerHTML = `<b>${rule.id + 1}) ${rule.description}</b>`;
  rulesContainer?.appendChild(ruleElement);
}

function initializeGame() {
  Logger.logGeneral('Game started!');
  initializeBoards();
  initializeEventListeners();
  updatePlayersInformation();
  setOnAction(onAction);
  setOnFallOffTheBoard(onFallOffTheBoard);
  setOnHighlight(highlightSquare);
}

initializeGame();
