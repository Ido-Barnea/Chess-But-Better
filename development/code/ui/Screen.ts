import { game } from '../Game';
import { BaseRule } from '../logic/rules/BaseRule';

const infoDisplay = document.getElementById('info-display');
const rulesContainer = document.getElementById('rules-container');

export function renderPlayersInformation() {
  if (infoDisplay) infoDisplay.textContent = '';

  const roundElement = document.createElement('p');
  roundElement.innerHTML = `Round: ${game.getRoundCounter()}`;
  infoDisplay?.appendChild(roundElement);

  const playersElement = document.createElement('p');
  playersElement.innerHTML = 'Players:';

  game.getPlayers().forEach((player) => {
    const playerInformationElement = document.createElement('div');

    const statusElement = document.createElement('p');
    const isCurrentPlayer = game.getCurrentPlayer() === player;
    const title = `${isCurrentPlayer ? '> ' : ''} ${player.color} Player:`;
    const status = `${title} ${player.xp} XP; ${player.gold} Gold.`;
    statusElement.innerHTML = status;

    playerInformationElement.appendChild(statusElement);

    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay?.appendChild(playersElement);
}

export function renderNewRule(rule: BaseRule) {
  const ruleElement = document.createElement('p');
  ruleElement.innerHTML = `<b>- ${rule.description}</b>`;
  rulesContainer?.appendChild(ruleElement);
}

export function showWinningAlert(winner: string) {
  alert(`${winner} Won!`);
}
