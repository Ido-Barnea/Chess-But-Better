import { Game } from './logic/Game';
import { isAllowedToAct, onPieceFellOffTheBoard, onPlayerAction } from './logic/PieceLogic';
import { comparePositions, convertSquareIdToPosition } from './logic/Utilities';
import { Item } from './logic/items/Items';
import { Piece } from './logic/pieces/Pieces';
import { Position, Square } from './logic/pieces/PiecesHelpers';
import { BaseRule } from './logic/rules/BaseRule';
import { destroyElementOnBoard, moveElementOnBoard, spawnItemElementOnBoard, spawnPieceElementOnBoard } from './ui/BoardManager';
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
  return Game.pieces.find((piece) => comparePositions(piece.position, position));
}

function getSquareIdFromElement(element: HTMLElement): string | undefined {
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
  const originSquareId = getSquareIdFromElement(draggedElement);
  if (!originSquareId) return;

  const draggedElementPosition = getPositionFromSquareId(originSquareId, boardId);
  const draggedPiece = findPieceAtPosition(draggedElementPosition);
  if (!draggedPiece) return;

  const targetSquareId = getSquareIdFromElement(targetElement);
  if (!targetSquareId) return;

  const targetElementPosition = getPositionFromSquareId(targetSquareId, boardId);

  if (targetElement.classList.contains('piece')) {
    const targetPiece = findPieceAtPosition(targetElementPosition);
    if (!targetPiece) return;

    onPlayerAction(draggedPiece, targetPiece);
  } else if (targetElement.classList.contains('item')) {
    Game.items.forEach((item) => {
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
  const squareId = getSquareIdFromElement(draggedElement);
  if (!squareId) return;

  const draggedElementPosition = getPositionFromSquareId(squareId, boardId);
  const draggedPiece = findPieceAtPosition(draggedElementPosition);
  if (!draggedPiece || !isAllowedToAct(draggedPiece)) return;

  onPieceFellOffTheBoard(draggedPiece);
}

export function movePieceOnBoard(
  draggedPiece: Piece,
  targetSquare: Square,
) {
  const draggedPieceCoordinates = draggedPiece.position.coordinates;
  const originSquareId = draggedPieceCoordinates.join(',');

  const targetSquareId = targetSquare.position.coordinates.join(',');
  
  moveElementOnBoard(draggedPiece.position.boardId, originSquareId, targetSquareId);
}

export function destroyPieceOnBoard(piece: Piece) {
  const tpieceCoordinates = piece.position.coordinates;
  const squareId = tpieceCoordinates.join(',');

  destroyElementOnBoard(squareId, piece.position.boardId);
}

export function destroyItemOnBoard(item: Item) {
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
  const itemCoordinates = item.position.coordinates;
  const squareId = itemCoordinates.join(',');

  spawnItemElementOnBoard(item, squareId);
}
