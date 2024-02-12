import { game } from './Game';
import { isPlayerAllowedToAct, onPieceFellOffTheBoard, onPlayerAction } from './logic/PieceLogic';
import { Player, PlayerColors } from './logic/Players';
import { comparePositions, convertSquareIdToPosition } from './logic/Utilities';
import { Item } from './logic/items/Items';
import { Piece } from './logic/pieces/Piece';
import { Position, Square } from './logic/pieces/PiecesUtilities';
import { BaseRule } from './logic/rules/BaseRule';
import { 
  destroyElementOnBoard,
  getAllSquareElements,
  getSquareElementById,
  highlightSquare,
  moveElementOnBoard,
  spawnItemElementOnBoard,
  spawnPieceElementOnBoard,
  highlightLastMove,
  getPieceElementBySquareId,
} from './ui/BoardManager';
import { changeInventoryVisibility, showItemOnInventory } from './ui/InventoriesUI';
import { renderPlayersInformation, renderNewRule } from './ui/Screen';

export function renderScreen() {
  renderPlayersInformation();
}

export function renderRules(newRule: BaseRule) {
  renderNewRule(newRule);
}

function findPieceAtPosition(
  position: Position,
): Piece | undefined {
  return game.getPieces().find((piece) => comparePositions(piece.position, position));
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

  const draggedElementPosition = getPositionFromSquareId(originSquareId, boardId);
  const draggedPiece = findPieceAtPosition(draggedElementPosition);
  if (!draggedPiece) return;

  const targetSquareId = getSquareIdByElement(targetElement);
  if (!targetSquareId) return;

  const targetElementPosition = getPositionFromSquareId(targetSquareId, boardId);

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

  onPieceFellOffTheBoard(draggedPiece);
}

function highlightLegalMoves(
  piece: Piece,
  boardId: string,
) {
  // Remove all highlights
  const allSquareElements = getAllSquareElements(boardId);
  for (const squareElement of allSquareElements) {
    highlightSquare(squareElement, false, false);
  }

  const legalMoves = piece.getLegalMoves();
  for (const position of legalMoves) {
    const positionSquareId = position.coordinates.join(',');
    const squareElement = getSquareElementById(positionSquareId, boardId) as HTMLElement;
    highlightSquare(squareElement, true, false);
  }
}

export function onPieceSelected(
  pieceElement: HTMLElement,
  boardId: string,
) {
  const squareId = getSquareIdByElement(pieceElement);
  if (!squareId) return;

  const pieceElementPosition = getPositionFromSquareId(squareId, boardId);
  const piece = findPieceAtPosition(pieceElementPosition);
  if (!piece || !isPlayerAllowedToAct(piece.player)) return;

  highlightLegalMoves(piece, boardId);
}

export function movePieceOnBoard(
  draggedPiece: Piece,
  targetSquare: Square,
) {
  const draggedPieceCoordinates = draggedPiece.position.coordinates;
  const originSquareId = draggedPieceCoordinates.join(',');
  
  const boardId = draggedPiece.position.boardId;
  const targetSquareId = targetSquare.position.coordinates.join(',');

  // Ensure square is not highlighted if piece did not move
  if (!comparePositions(draggedPiece.position, targetSquare.position)) {
    const originSquareElement = getSquareElementById(originSquareId, boardId) as HTMLElement;
    const targetSquareElement = getSquareElementById(targetSquareId, boardId) as HTMLElement;
    highlightLastMove(originSquareElement, targetSquareElement, boardId);
  }
  
  moveElementOnBoard(draggedPiece.position.boardId, originSquareId, targetSquareId);
}

export function destroyPieceOnBoard(piece: Piece) {
  const tpieceCoordinates = piece.position.coordinates;
  const squareId = tpieceCoordinates.join(',');

  destroyElementOnBoard(squareId, piece.position.boardId);
}

export function destroyItemOnBoard(item: Item) {
  if (!item.position) return;

  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  destroyElementOnBoard(squareId, item.position.boardId);
}

export function spawnPieceOnBoard(piece: Piece) {
  const pieceCoordinates = piece.position.coordinates;
  const squareId = pieceCoordinates.join(',');

  spawnPieceElementOnBoard(piece, squareId);
}

export function spawnItemOnBoard(item: Item) {
  if (!item.position) return;

  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  spawnItemElementOnBoard(item, squareId);
}

export function changePieceToAnotherPlayer(piece: Piece) {
  const squareId = piece.position.coordinates.join(',');
  const boadrId = piece.position.boardId;
  const pieceElement = getPieceElementBySquareId(squareId, boadrId);
  if (pieceElement) {
    pieceElement.classList.remove(piece.player.color.toLowerCase());
    const enemyPlayerColor = 
      piece.player.color === PlayerColors.WHITE 
        ? PlayerColors.BLACK 
        : PlayerColors.WHITE;
    pieceElement.classList.add(enemyPlayerColor.toLowerCase());
  }

  piece.player = game.getPlayers().filter(_player => _player !== piece.player)[0];
}

export function winGame(winnerPlayer: Player){
  game.setWinner(winnerPlayer);
}

export function changeShownInventory(player: Player) {
  if (changeInventoryVisibility(player.color)) {
    player.inventory.items.forEach((item) =>  {
      console.log(item);
      showItemOnInventory(item,player.color);
    });
  }
}
