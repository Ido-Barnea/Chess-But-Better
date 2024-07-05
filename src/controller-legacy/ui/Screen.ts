import { game } from '../Game';
import { Player } from '../logic/players/Player';

const roundInformation = document.getElementById(
  'info-container-round-information',
);
const playersElement = document.getElementById('info-container-players');

const unicornAttackButton = document.getElementById('unicorn-attack');

function createRoundElement(): HTMLElement {
  const roundElement = document.createElement('h3');

  const round = Math.round(game.getPlayersTurnSwitcher().getTurnsCount() / 2);
  roundElement.innerHTML = `Round: ${round}`;

  roundElement.style.textAlign = 'center';

  return roundElement;
}

function createMoveElement(): HTMLElement {
  const moveElement = document.createElement('h5');

  const move = game.getPlayersTurnSwitcher().getTurnsCount();
  moveElement.innerHTML = `Move: ${move}`;

  moveElement.style.textAlign = 'center';

  return moveElement;
}

function renderRoundInformationElement() {
  if (!roundInformation) return;
  roundInformation.innerHTML = '';

  roundInformation.setAttribute('colspan', '3');

  const roundElement = createRoundElement();
  const moveElement = createMoveElement();

  moveElement.style.color = 'var(--gray-color)';

  roundInformation.appendChild(roundElement);
  roundInformation.appendChild(moveElement);
}

function createPlayerNameElement(player: Player): HTMLElement {
  const playerNameElement = document.createElement('h4');
  const playerName = player.color;
  playerNameElement.innerHTML = playerName;

  const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();
  if (currentPlayer === player) {
    playerNameElement.style.color = 'var(--accent-color)';
  }

  return playerNameElement;
}

function createPlayerGoldElement(player: Player): HTMLElement {
  const playerGoldElement = document.createElement('p');
  const playerGold = `${player.gold} Gold`;
  playerGoldElement.innerHTML = playerGold;

  playerGoldElement.style.color = 'var(--gold-color)';

  return playerGoldElement;
}

function createPlayerXPElement(player: Player): HTMLElement {
  const playerXPElement = document.createElement('p');
  const playerXP = `${player.xp} XP`;
  playerXPElement.innerHTML = playerXP;

  playerXPElement.style.color = 'var(--bright-heaven-square)';

  return playerXPElement;
}

function renderVerticalLineElement(playersElement: HTMLElement, index: number) {
  if (index < game.getPlayers().length - 1) {
    const verticalLineElement = document.createElement('td');
    verticalLineElement.classList.add('vertical-line');

    playersElement.appendChild(verticalLineElement);
  }
}

function renderPlayersInformation() {
  if (!playersElement) return;
  playersElement.innerHTML = '';

  game.getPlayers().forEach((player, index) => {
    const playerInformationElement = document.createElement('td');
    playerInformationElement.classList.add('players-information');

    const playerNameElement = createPlayerNameElement(player);
    const playerGoldElement = createPlayerGoldElement(player);
    const playerXPElement = createPlayerXPElement(player);

    playerInformationElement.appendChild(playerNameElement);
    playerInformationElement.appendChild(playerGoldElement);
    playerInformationElement.appendChild(playerXPElement);

    playersElement.appendChild(playerInformationElement);
    renderVerticalLineElement(playersElement, index);
  });
}

export function renderGameInformation() {
  renderRoundInformationElement();
  renderPlayersInformation();
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
