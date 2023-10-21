import { Logger } from './logger';
import {
  initializeEventListeners,
  setOnAction,
  setOnFallOffTheBoard,
  setOnHighlight,
} from './events';
import { highlightSquare, initializeBoards } from './boards';
import {
  onAction,
  onFallOffTheBoard,
  getCurrentPlayer,
  players,
  roundCounter,
} from './logic';
import { Rule } from './rules';

const infoDisplay = document.getElementById('info-display')!;
const rulesContainer = document.getElementById('rules-container')!;

export function updatePlayersInformation() {
  infoDisplay.textContent = '';

  const roundElement = document.createElement('p');
  roundElement.innerHTML = `Round: ${roundCounter}`;
  infoDisplay.appendChild(roundElement);

  const playersElement = document.createElement('p');
  playersElement.innerHTML = 'Players:';

  players.forEach((player) => {
    const playerInformationElement = document.createElement('div');

    const statusElement = document.createElement('p');
    const isCurrentPlayer = getCurrentPlayer() === player;
    const title = `${isCurrentPlayer ? '> ' : ''} ${player.color} Player:`;
    const status = `${title} ${player.xp} XP; ${player.gold} Gold.`;
    statusElement.innerHTML = status;

    const inventoryElement = document.createElement('p');
    const inventory = `Inventory: ${player.inventory.items}`;
    inventoryElement.innerHTML = inventory;

    playerInformationElement.appendChild(statusElement);
    playerInformationElement.appendChild(inventoryElement);

    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay.appendChild(playersElement);
}

export function updateRules(rule: Rule) {
  const ruleElement = document.createElement('p');
  ruleElement.innerHTML = `<b>${rule.id + 1}) ${rule.description}</b>`;
  rulesContainer.appendChild(ruleElement);
}

function initializeGame() {
  Logger.log('Game started!');
  initializeBoards();
  initializeEventListeners();
  updatePlayersInformation();
  setOnAction(onAction);
  setOnFallOffTheBoard(onFallOffTheBoard);
  setOnHighlight(highlightSquare);
}

initializeGame();
