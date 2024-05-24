import { BasePiece } from '../../model/pieces/abstract/BasePiece';
import { game } from '../Game';
import { upgradePiece } from '../LogicAdapter';
import { Player } from '../logic/players/Player';

export function showUpgradeablePiecesElements(
  piece: BasePiece,
  upgradeablePieces: Array<new (player: Player) => BasePiece>,
) {
  const upgradesContainer = document.getElementById('piece-upgrades-container');
  if (!upgradesContainer) return;

  upgradesContainer.innerHTML = '';

  if (upgradeablePieces.length === 0) {
    const noAvailableUpgradesTextElement = document.createElement('p');
    noAvailableUpgradesTextElement.classList.add('piece-upgrades-message');
    noAvailableUpgradesTextElement.innerHTML = `${piece.resource.name} doesn't have any available upgrades.`;

    upgradesContainer.appendChild(noAvailableUpgradesTextElement);
  } else {
    upgradeablePieces.forEach((upgradeablePieceType) => {
      const upgradeablePiece = new upgradeablePieceType(
        game.getPlayersTurnSwitcher().getCurrentPlayer(),
      );

      const upgradeElement = document.createElement('div');
      upgradeElement.id = upgradeablePiece.resource.name;
      upgradeElement.classList.add('upgraded-piece');
      upgradeElement.classList.add(upgradeablePiece.player.color);
      upgradeElement.innerHTML = upgradeablePiece.resource.resource;
      upgradeElement.addEventListener('click', () => {
        upgradePiece(piece, upgradeablePiece);
        showUpgradeablePiecesElements(
          upgradeablePiece,
          upgradeablePiece.modifiers.upgrades,
        );
      });

      const upgradePriceElement = document.createElement('p');
      upgradePriceElement.classList.add('piece-upgrade-item-price');
      upgradePriceElement.innerHTML = upgradeablePiece.stats.price.toString();

      const upgradeSquare = document.createElement('div');
      upgradeSquare.classList.add('upgrade-square');
      upgradeSquare.appendChild(upgradeElement);
      upgradeSquare.appendChild(upgradePriceElement);

      upgradesContainer.appendChild(upgradeSquare);
    });
  }
}
