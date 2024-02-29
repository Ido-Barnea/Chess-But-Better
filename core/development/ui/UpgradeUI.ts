import { game } from '../Game';
import { upgradePiece } from '../LogicAdapter';
import { Player } from '../logic/Players';
import { Piece } from '../logic/pieces/Piece';

export function showUpgradeablePiecesElements(
  piece: Piece,
  upgradeablePieces: Array<new (player: Player) => Piece>,
) {
  const upgradesContainer = document.getElementById('piece-upgrades-container');
  if (!upgradesContainer) return;

  upgradesContainer.innerHTML = '';

  upgradeablePieces.forEach((upgradeablePieceType) => {
    const upgradeablePiece = new upgradeablePieceType(game.getCurrentPlayer());

    const upgradeElement = document.createElement('div');
    upgradeElement.id = upgradeablePiece.name;
    upgradeElement.classList.add('upgraded-piece');
    upgradeElement.innerHTML = upgradeablePiece.resource;
    upgradeElement.addEventListener('click', () => {
      upgradePiece(piece, upgradeablePiece);
    });

    const upgradePriceElement = document.createElement('p');
    upgradePriceElement.classList.add('shop-item-price');
    upgradePriceElement.innerHTML = upgradeablePiece.price.toString();

    const upgradeSquare = document.createElement('div');
    upgradeSquare.classList.add('upgrade-square');
    upgradeSquare.appendChild(upgradeElement);
    upgradeSquare.appendChild(upgradePriceElement);

    upgradesContainer.appendChild(upgradeSquare);
  });
}
