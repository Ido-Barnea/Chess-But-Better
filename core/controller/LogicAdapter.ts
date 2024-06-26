import { game, shop } from './Game';
import { isPlayerAllowedToAct, onPlayerAction } from './logic/PieceLogic';
import { Player } from './logic/players/Player';
import {
  comparePositions,
  convertSquareIdToPosition,
  getPieceByPosition,
} from './logic/Utilities';
import { BaseItem } from './logic/items/abstract/Item';
import {
  destroyElementOnBoard,
  getAllSquareElements,
  getSquareElementById,
  moveElementOnBoard,
  spawnItemElementOnBoard,
  spawnPieceElementOnBoard,
  highlightLastMove,
  getPieceElementBySquareId,
  highlightLegalMove,
  spawnItemOnChildElement,
  destroyElementOnPiece,
} from './ui/BoardManager';
import {
  hideUnicornAttackButton,
  renderGameInformation,
  showUnicornAttackButton,
} from './ui/Screen';
import {
  switchShownInventory,
  showItemOnInventory,
  destroyItemInInventory,
} from './ui/InventoriesUI';
import { Shield } from './logic/items/Shield';
import { Trap } from './logic/items/Trap';
import { HEAVEN_BOARD_ID, HELL_BOARD_ID } from './Constants';
import { showUpgradeablePiecesElements } from './ui/UpgradeUI';
import { PlayerColor } from './logic/players/types/PlayerColor';
import { Unicorn } from './logic/pieces/Unicorn';
import { KillPieceByFallingOffTheBoardAction } from './logic/actions/KillPieceByFallingOffTheBoardAction';
import { KillPieceByPieceAction } from './logic/actions/KillPieceByPieceAction';
import { ShopActionResult } from './logic/shop/types/ShopActionResult';
import { updateShopButtonsState } from './ui/ShopUI';
import { Position } from '../model/types/Position';
import { BasePiece } from '../model/pieces/abstract/BasePiece';
import { Square } from '../model/types/Square';

export function renderScreen() {
  renderGameInformation();
}

function findPieceAtPosition(position: Position): BasePiece | undefined {
  return game
    .getPieces()
    .find((piece) => comparePositions(piece.position, position));
}

function getSquareIdByElement(element: HTMLElement): string | undefined {
  while (element && !element.getAttribute('square-id')) {
    element = element.parentElement as HTMLElement;
  }
  return element?.getAttribute('square-id') || undefined;
}

function getPositionFromSquareId(squareId: string, boardId: string): Position {
  return {
    coordinates: convertSquareIdToPosition(squareId),
    boardId: boardId,
  };
}

export function onActionTriggered(
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  boardId: string,
) {
  const originSquareId = getSquareIdByElement(draggedElement);
  if (!originSquareId) return;

  const draggedElementPosition = getPositionFromSquareId(
    originSquareId,
    boardId,
  );
  const draggedPiece = findPieceAtPosition(draggedElementPosition);
  if (!draggedPiece) return;

  const targetSquareId = getSquareIdByElement(targetElement);
  if (!targetSquareId) return;

  const targetElementPosition = getPositionFromSquareId(
    targetSquareId,
    boardId,
  );

  if (targetElement.classList.contains('piece')) {
    const targetPiece = findPieceAtPosition(targetElementPosition);
    if (!targetPiece) return;

    onPlayerAction(draggedPiece, targetPiece);
  } else if (targetElement.classList.contains('item')) {
    game.getItems().forEach((item) => {
      if (comparePositions(item.position, targetElementPosition)) {
        onPlayerAction(draggedPiece, item);
      }
    });
  } else {
    const targetSquare: Square = {
      position: targetElementPosition,
    };
    onPlayerAction(draggedPiece, targetSquare);
  }
}

export function onFellOffTheBoardTriggered(
  draggedElement: HTMLElement,
  boardId: string,
) {
  const squareId = getSquareIdByElement(draggedElement);
  if (!squareId) return;

  const draggedElementPosition = getPositionFromSquareId(squareId, boardId);
  const draggedPiece = findPieceAtPosition(draggedElementPosition);
  if (!draggedPiece || !isPlayerAllowedToAct(draggedPiece.player)) return;

  new KillPieceByFallingOffTheBoardAction(draggedPiece).execute();
}

function highlightLegalMoves(piece: BasePiece, boardId: string) {
  // Remove all highlights
  const allSquareElements = getAllSquareElements(boardId);
  for (const squareElement of allSquareElements) {
    highlightLegalMove(squareElement, false);
  }

  const legalMoves = piece.getLegalMoves();
  for (const position of legalMoves) {
    const positionSquareId = position.coordinates.join(',');
    const squareElement = getSquareElementById(
      positionSquareId,
      boardId,
    ) as HTMLElement;
    highlightLegalMove(squareElement, true);
  }
}

export function removeAllHighlights(boardId: string) {
  const allSquareElements = getAllSquareElements(boardId);
  for (const squareElement of allSquareElements) {
    highlightLegalMove(squareElement, false);
  }
}

export function onPieceSelected(pieceElement: HTMLElement, boardId: string) {
  const squareId = getSquareIdByElement(pieceElement);
  if (!squareId) return;

  const pieceElementPosition = getPositionFromSquareId(squareId, boardId);
  const piece = findPieceAtPosition(pieceElementPosition);
  if (!piece || !isPlayerAllowedToAct(piece.player)) return;

  if (piece instanceof Unicorn) {
    showUnicornAttackButton();
  } else {
    hideUnicornAttackButton();
  }

  showUpgradeablePiecesElements(piece, piece.modifiers.upgrades);
  highlightLegalMoves(piece, boardId);
}

export function upgradePiece(
  upgradeablePiece: BasePiece,
  upgradedPiece: BasePiece,
) {
  const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();
  if (currentPlayer.xp < upgradedPiece.stats.price) return;
  currentPlayer.xp -= upgradedPiece.stats.price;

  // Destroy piece
  destroyPieceOnBoard(upgradeablePiece);
  game.setPieces(
    game.getPieces().filter((piece) => piece !== upgradeablePiece),
  );

  // Spawn upgraded piece
  upgradedPiece.position = upgradeablePiece.position;

  const gamePieces = game.getPieces();
  gamePieces.push(upgradedPiece);

  spawnPieceOnBoard(upgradedPiece);
  renderScreen();
}

export function movePieceOnBoard(
  draggedPiece: BasePiece,
  targetPosition: Position,
) {
  if (!draggedPiece.position) return;

  const draggedPieceCoordinates = draggedPiece.position.coordinates;
  const originSquareId = draggedPieceCoordinates.join(',');

  const boardId = draggedPiece.position.boardId;
  const targetSquareId = targetPosition.coordinates.join(',');

  // Ensure square is not highlighted if piece did not move
  if (!comparePositions(draggedPiece.position, targetPosition)) {
    const originSquareElement = getSquareElementById(
      originSquareId,
      boardId,
    ) as HTMLElement;

    const targetSquareElement = getSquareElementById(
      targetSquareId,
      boardId,
    ) as HTMLElement;

    highlightLastMove(originSquareElement, targetSquareElement, boardId);
  }

  moveElementOnBoard(
    draggedPiece.position.boardId,
    originSquareId,
    targetSquareId,
  );
}

export function destroyPieceOnBoard(piece: BasePiece, originBoardId?: string) {
  if (!piece.position) return;

  originBoardId = originBoardId || piece.position.boardId;
  const pieceCoordinates = piece.position.coordinates;
  const squareId = pieceCoordinates.join(',');

  let fadeDirection;
  switch (piece.position.boardId) {
    case HEAVEN_BOARD_ID: {
      fadeDirection = 1;
      break;
    }
    case HELL_BOARD_ID: {
      fadeDirection = -1;
      break;
    }
    default: {
      fadeDirection = 0;
    }
  }

  destroyElementOnBoard(squareId, originBoardId, fadeDirection);
}

export function destroyItemOnBoard(item: BaseItem) {
  if (!item.position) return;

  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  destroyElementOnBoard(squareId, item.position.boardId);
}

export function destroyItemOnPiece(piece: BasePiece) {
  if (!piece.position || !piece.stats.isEquippedItem) return;

  const pieceCoordinates = piece.position.coordinates;
  const squareId = pieceCoordinates.join(',');

  piece.stats.isEquippedItem = false;
  destroyElementOnPiece(squareId, piece.position.boardId);
}

export function spawnPieceOnBoard(piece: BasePiece) {
  const pieceCoordinates = piece.position?.coordinates;
  const squareId = pieceCoordinates?.join(',');

  if (!squareId) return;
  spawnPieceElementOnBoard(piece, squareId);
}

export function spawnItemOnBoard(item: BaseItem) {
  if (!item.position) return;

  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  spawnItemElementOnBoard(item, squareId);
}

export function spawnItemOnPiece(item: BaseItem) {
  if (!item.position) return;

  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  spawnItemOnChildElement(item, squareId, true);
}

export function changePieceToAnotherPlayer(piece: BasePiece) {
  const squareId = piece.position?.coordinates.join(',');
  const boardId = piece.position?.boardId;
  if (!boardId || !squareId) return;
  const pieceElement = getPieceElementBySquareId(squareId, boardId);
  if (pieceElement) {
    pieceElement.classList.remove(piece.player.color.toLowerCase());
    const enemyPlayerColor =
      piece.player.color === PlayerColor.WHITE
        ? PlayerColor.BLACK
        : PlayerColor.WHITE;
    pieceElement.classList.add(enemyPlayerColor.toLowerCase());
  }

  piece.player = game
    .getPlayers()
    .filter((_player) => _player !== piece.player)[0];
}

export function switchInventory(player: Player) {
  if (switchShownInventory(player.color)) {
    player.inventory.getItems().forEach((item) => {
      showItemOnInventory(item, player.color);
    });
  }
}

export function canPlaceItemOnBoard(
  itemElement: HTMLElement,
  targetElement: HTMLElement,
): boolean {
  if (game.getWasItemPlacedThisTurn() || !targetElement) return false;

  const currentBoardId = getCurrentBoardId();
  if (!currentBoardId) return false;

  const squareId = getSquareIdByElement(targetElement);
  if (!squareId) return false;

  const squarePosition = getPositionFromSquareId(squareId, currentBoardId);

  const usedItem = getCurrentPlayerInventoryItemById(itemElement.id);
  if (!usedItem) return false;

  usedItem.position = squarePosition;

  switch (itemElement.id) {
    case 'trap': {
      if (!targetElement.classList.contains('square')) return false;
      new Trap().use(squarePosition);
      break;
    }
    case 'shield': {
      if (!targetElement.classList.contains('piece')) return false;

      const targetPiece = getPieceByPosition(squarePosition);
      if (!targetPiece) return false;

      targetPiece.stats.isEquippedItem = true;
      new Shield().use(squarePosition);

      break;
    }
  }

  const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();
  currentPlayer.inventory.removeItem(usedItem);
  game.switchWasItemPlacedThisTurn();
  destroyItemInInventory(itemElement, currentPlayer.color);

  return true;
}

export function getCurrentBoardId(): string | undefined {
  const boards = document.getElementsByClassName('board');
  let currentOpenBoard;
  for (let i = 0; i < boards.length; i++) {
    if (!boards[i].classList.contains('collapsed')) {
      currentOpenBoard = boards[i];
      break;
    }
  }

  return currentOpenBoard?.id;
}

export function getCurrentPlayerInventoryItemById(
  itemId: string,
): BaseItem | undefined {
  const player = game.getPlayersTurnSwitcher().getCurrentPlayer();
  const draggedItem = player.inventory.getItems().filter((item) => {
    return item.name === itemId;
  })[0];

  return draggedItem;
}

export function returnItemToInventory(itemElement: HTMLElement) {
  const usedItem = getCurrentPlayerInventoryItemById(itemElement.id);
  if (!usedItem) return;

  const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();

  destroyItemInInventory(itemElement, currentPlayer.color);
  showItemOnInventory(usedItem, currentPlayer.color);
}

export function getShopItemById(itemId: string) {
  const purchaseableItems = shop.getItems();

  const item = purchaseableItems.filter((item) => {
    return item.name == itemId;
  })[0];

  return item;
}

export function buyItem(itemId: string) {
  const item = getShopItemById(itemId);
  const currentPlayer = game.getPlayersTurnSwitcher().getCurrentPlayer();

  if (shop.buyItem(item, currentPlayer) === ShopActionResult.SUCCESS) {
    showItemOnInventory(item, currentPlayer.color);
    updateShopButtonsState(shop.getItems(), currentPlayer.gold);
  }

  renderScreen();
}

export function getPieceByElement(pieceElement: HTMLElement, boardId: string) {
  const squareId = getSquareIdByElement(pieceElement);
  if (!squareId) return;

  const pieceElementPosition = getPositionFromSquareId(squareId, boardId);
  const piece = findPieceAtPosition(pieceElementPosition);
  return piece;
}

export function unicornAttackAttempt(
  pieceElement: HTMLElement,
  targetPieceElement: HTMLElement,
  boardId: string,
) {
  const unicornPiece = getPieceByElement(pieceElement, boardId);
  if (!unicornPiece || !(unicornPiece instanceof Unicorn)) return;

  const attackerPlayer = unicornPiece.player;
  if (attackerPlayer.usedAbility || !isPlayerAllowedToAct(attackerPlayer))
    return;

  const targetPiece = getPieceByElement(targetPieceElement, boardId);
  if (!targetPiece) return;

  const targetablePieces = unicornPiece.getAttackablePieces();

  if (!targetablePieces.includes(targetPiece)) return;

  unicornPiece.player.usedAbility = true;
  new KillPieceByPieceAction(targetPiece, unicornPiece).execute();
}
