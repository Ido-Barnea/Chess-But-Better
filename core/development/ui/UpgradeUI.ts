import { Piece } from '../logic/pieces/Piece';


export function showUpgradeElement(upgradePiece: Piece) {
  const upgradeElement = document.createElement('div') as HTMLElement;
  upgradeElement.id = upgradePiece.name;
  upgradeElement.classList.add('upgradeable-piece');
  upgradeElement.innerHTML = upgradePiece.resource;

  const upgradesContainer = document.getElementById('upgrade-container');
  upgradesContainer?.childNodes.forEach((child) => {
    child.remove();
  });

  upgradesContainer?.appendChild(upgradeElement);
}