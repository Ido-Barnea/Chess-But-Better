import { Piece } from '../logic/pieces/Piece';

export function showUpgradeElement(upgradePiece: Piece) {
  const upgradeElement = document.createElement('div');
  upgradeElement.id = upgradePiece.name;
  upgradeElement.classList.add('upgradeable-piece');
  upgradeElement.innerHTML = upgradePiece.resource;

  const upgradesContainer = document.getElementById('upgrade-container');
  upgradesContainer?.childNodes.forEach((child) => {
    child.remove();
  });

  const upgradeSquare = document.createElement('div');
  upgradeSquare.classList.add('upgrade-square');
  upgradeSquare.appendChild(upgradeElement);

  upgradesContainer?.appendChild(upgradeSquare);
}
