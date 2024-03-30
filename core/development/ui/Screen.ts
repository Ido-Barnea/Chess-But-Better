import { game } from '../Game';

const infoDisplay = document.getElementById('info-container');

const unicornAttackButton = document.getElementById('unicorn-attack');

export function renderPlayersInformation() {
  if (infoDisplay) infoDisplay.textContent = '';

  const roundElement = document.createElement('span');
  roundElement.classList.add('round-info');
  const round = Math.round(game.getPlayersTurnSwitcher().getTurnsCount() / 2);
  roundElement.innerHTML = `Round: ${round}`;
  infoDisplay?.appendChild(roundElement);

  const playersElement = document.createElement('div');

  game.getPlayers().forEach((player) => {
    const playerInformationElement = document.createElement('div');

    const statusElement = document.createElement('div');
    statusElement.classList.add('status-container');
    const isCurrentPlayer =
      game.getPlayersTurnSwitcher().getCurrentPlayer() === player;
    const title = document.createElement('span');
    title.classList.add('player-title');
    title.innerText = `${isCurrentPlayer ? '> ' : ''} ${player.color}`;
    const xpStatus = document.createElement('span');
    xpStatus.classList.add('xp-status');
    xpStatus.innerHTML = `${player.xp} XP`;
    const goldStatus = document.createElement('span');
    goldStatus.classList.add('gold-status');
    goldStatus.innerHTML = `${player.gold} Gold`;
    statusElement.appendChild(xpStatus);
    statusElement.appendChild(goldStatus);

    playerInformationElement.appendChild(title);
    playerInformationElement.appendChild(statusElement);

    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay?.appendChild(playersElement);
}

export function showWinningAlert(winner: string) {
  window.alert(`${winner} Won!`);
  window.location.href = '/';
}

export function initializeAbility() {
  if (!unicornAttackButton) return;
  unicornAttackButton.innerHTML = '<button>ATTACK</button>';
}

export function hideUnicornAttackButton() {
  if (!unicornAttackButton) return;
  unicornAttackButton.classList.add('collapsed');
}

export function showUnicornAttackButton() {
  if (!unicornAttackButton) return;
  unicornAttackButton.classList.remove('collapsed');
}
