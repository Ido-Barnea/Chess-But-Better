import { game } from '../Game';
import { Player } from '../logic/Players';
import { Piece } from '../logic/pieces/Piece';

export function showUpgradeablePiecesElements(
  upgradeablePieces: Array<new (player: Player) => Piece>,
) {
  const upgradesContainer = document.getElementById('piece-upgrades-container');
  if (!upgradesContainer) return;
  
  upgradesContainer.innerHTML = '';

  upgradeablePieces.forEach(upgradeablePieceType => {
    const upgradeablePiece = new upgradeablePieceType(game.getCurrentPlayer());

    const upgradeElement = document.createElement('div');
    upgradeElement.id = upgradeablePiece.name;
    upgradeElement.classList.add('upgraded-piece');
    upgradeElement.innerHTML = upgradeablePiece.resource;
    //TODO: upgradeElement.addEventListener('click', onUpgradedPieceClick);

    const upgradeSquare = document.createElement('div');
    upgradeSquare.classList.add('upgrade-square');
    upgradeSquare.appendChild(upgradeElement);

    upgradesContainer.appendChild(upgradeSquare);
  });
}
