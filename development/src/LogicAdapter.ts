import { Game } from './logic/GameController';
import { isAllowedToAct, onPieceFellOffTheBoard, onPlayerAction } from './logic/PieceLogic';
import { comparePositions, convertSquareIdToPosition } from './logic/Utilities';
import { Item } from './logic/items/Items';
import { Piece } from './logic/pieces/Pieces';
import { Position, Square } from './logic/pieces/PiecesHelpers';
import { BaseRule } from './logic/rules/BaseRule';
import { destroyElementOnBoard, moveElementOnBoard, spawnItemElementOnBoard, spawnPieceElementOnBoard } from './ui/BoardManager';
import { renderPlayersInformation, renderNewRule } from './ui/Screen';

export function renderScreen(game: Game) {
  renderPlayersInformation(game);
}

export function renderRules(newRule: BaseRule) {
  renderNewRule(newRule);
}

function findPieceAtPosition(
  game: Game,
  position: Position,
): Piece | undefined {
  return game.pieces.find((piece) => comparePositions(piece.position, position));
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
  game: Game,
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  boardId: string,
) {
  const originSquareId = getSquareIdFromElement(draggedElement);
  if (!originSquareId) return;

  const draggedElementPosition = getPositionFromSquareId(originSquareId, boardId);
  const draggedPiece = findPieceAtPosition(game, draggedElementPosition);
  if (!draggedPiece) return;

  const targetSquareId = getSquareIdFromElement(targetElement);
  if (!targetSquareId) return;

  const targetElementPosition = getPositionFromSquareId(targetSquareId, boardId);

  if (targetElement.classList.contains('piece')) {
    const targetPiece = findPieceAtPosition(game, targetElementPosition);
    if (!targetPiece) return;

    onPlayerAction(game, draggedPiece, targetPiece);
  } else if (targetElement.classList.contains('item')) {
    game.items.forEach((item) => {
      if (comparePositions(item.position, targetElementPosition)) {
        onPlayerAction(game, draggedPiece, item);
      }
    });
  } else {
    const targetSquare: Square = {
      position: targetElementPosition,
    };
    onPlayerAction(game, draggedPiece, targetSquare);
  }
}

export function onFellOffTheBoardTriggered(
  game: Game,
  draggedElement: HTMLElement,
  boardId: string,
) {
  const squareId = getSquareIdFromElement(draggedElement);
  if (!squareId) return;

  const draggedElementPosition = getPositionFromSquareId(squareId, boardId);
  const draggedPiece = findPieceAtPosition(game, draggedElementPosition);
  if (!draggedPiece || !isAllowedToAct(game, draggedPiece)) return;

  onPieceFellOffTheBoard(game, draggedPiece);
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
