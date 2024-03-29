import { game } from '../Game';

const infoDisplay = document.getElementById('info-container');

export function renderPlayersInformation() {
  if (infoDisplay) infoDisplay.textContent = '';

  const roundElement = document.createElement('p');
  const round = Math.round(game.getPlayersTurnSwitcher().getTurnsCount() / 2);
  roundElement.innerHTML = `Round: ${round}`;
  infoDisplay?.appendChild(roundElement);

  const playersElement = document.createElement('p');
  playersElement.innerHTML = 'Players:';

  game.getPlayers().forEach((player) => {
    const playerInformationElement = document.createElement('div');

    const statusElement = document.createElement('p');
    const isCurrentPlayer =
      game.getPlayersTurnSwitcher().getCurrentPlayer() === player;
    const title = `${isCurrentPlayer ? '> ' : ''} ${player.color} Player:`;
    const status = `${title} ${player.xp} XP; ${player.gold} Gold.`;
    statusElement.innerHTML = status;

    playerInformationElement.appendChild(statusElement);

    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay?.appendChild(playersElement);
}

export function showWinningAlert(winner: string) {
  window.alert(`${winner} Won!`);
  window.location.href = '/';
}
