import { updatePlayersInformation } from '../Game';
import { OVERWORLD_BOARD_ID } from './Constants';
import { actOnTurn, isAllowedToMove, permanentlyKillPiece } from './PieceLogic';
import { Player, PlayerColors } from './Players';
import { comparePositions, convertSquareIdToPosition } from './Utilities';
import { Item } from './items/Items';
import { Bishop } from './pieces/Bishop';
import { King } from './pieces/King';
import { Knight } from './pieces/Knight';
import { Pawn } from './pieces/Pawn';
import { Piece } from './pieces/Pieces';
import { Position, Square } from './pieces/PiecesHelpers';
import { Queen } from './pieces/Queen';
import { Rook } from './pieces/Rook';
import { activeRules } from './rules/RulesManager';

const whitePlayer = new Player(PlayerColors.WHITE);
const blackPlayer = new Player(PlayerColors.BLACK);
export const players = [whitePlayer, blackPlayer];

export let pieces: Array<Piece> = [
  new Rook({ coordinates: [0, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [1, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [2, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Queen({ coordinates: [3, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new King({ coordinates: [4, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Bishop({ coordinates: [5, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Knight({ coordinates: [6, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Rook({ coordinates: [7, 0], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [1, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [2, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [3, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [4, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [5, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [6, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [7, 1], boardId: OVERWORLD_BOARD_ID }, blackPlayer),
  new Pawn({ coordinates: [0, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [1, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [2, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [3, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [4, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [5, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [6, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Pawn({ coordinates: [7, 6], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [0, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [1, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [2, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Queen({ coordinates: [3, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new King({ coordinates: [4, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Bishop({ coordinates: [5, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Knight({ coordinates: [6, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
  new Rook({ coordinates: [7, 7], boardId: OVERWORLD_BOARD_ID }, whitePlayer),
];
export let items: Array<Item> = [];
let currentPlayerIndex = 0;
let turnCounter = 0;
export let roundCounter = 1;
export let deathCounter = 0;

export let isCastling = false;
export let isFriendlyFire = false;
export let isPieceKilled = false;

export let fellOffTheBoardPiece: Piece | undefined;

export const increaseDeathCount = () => deathCounter++;
export const triggerIsPieceKilled = () => isPieceKilled = true;
export const updateFriendlyFireStatus = (updatedIsFriendlyFire: boolean) => isFriendlyFire = updatedIsFriendlyFire;
export const updatePieces = (updatedPieces: Array<Piece>) => pieces = updatedPieces;
export const updateItems = (updatedItems: Array<Item>) => items = updatedItems;

export function endTurn() {
  activeRules.forEach((rule) => {
    rule.trigger();
  });

  resetVariables();

  currentPlayerIndex =
    currentPlayerIndex + 1 < players.length ? currentPlayerIndex + 1 : 0;
  turnCounter++;
  if (turnCounter % players.length === 0) {
    turnCounter = 0;
    roundCounter++;
  }

  updatePlayersInformation();
}

function resetVariables() {
  isCastling = false;
  isFriendlyFire = false;
  isPieceKilled = false;
  fellOffTheBoardPiece = undefined;
  pieces.forEach((piece) => {
    if (piece.player !== getCurrentPlayer() && piece instanceof Pawn){
      piece.enPassant = false;
      if ((piece as Pawn).enPassantPosition) {
        (piece as Pawn).enPassantPosition = undefined;
      }
    }
  });
}

export function getCurrentPlayer(): Player {
  return players[currentPlayerIndex];
}

export function switchIsCastling() {
  isCastling = !isCastling;
}

export function onAction(
  draggedElement: HTMLElement,
  targetElement: HTMLElement,
  board: string,
) {
  const draggedElementParentElement =
    draggedElement.parentElement as HTMLElement;

  const squareId = draggedElementParentElement.getAttribute('square-id');
  if (!squareId) return;

  const draggedElementPosition: Position = {
    coordinates: convertSquareIdToPosition(squareId),
    boardId: board,
  };

  const draggedPiece: Piece | undefined = pieces.find((piece) =>
    comparePositions(
      piece.position,
      draggedElementPosition,
    ),
  );

  if (targetElement.classList.contains('piece')) {
    const squareElement = targetElement.parentElement;
    const squareId = squareElement?.getAttribute('square-id');
    if (!squareId) return;

    const targetElementPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    const targetPiece: Piece | undefined = pieces.find((piece) => {
      return comparePositions(
        targetElementPosition,
        piece.position,
      );
    });

    actOnTurn(draggedPiece, targetPiece);
  } else if (targetElement.classList.contains('item')) {
    let squareElement = targetElement as HTMLElement;
    while (!squareElement.getAttribute('square-id')) {
      squareElement = squareElement.parentElement as HTMLElement;
    }

    const squareId = squareElement.getAttribute('square-id');
    if (!squareId) return;

    const itemPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    items.forEach((item) => {
      if (comparePositions(item.position, itemPosition)) {
        actOnTurn(draggedPiece, item);
      }
    });
  } else {
    const squareId = targetElement.getAttribute('square-id');
    if (!squareId) return;

    const targetSquare: Square = {
      position: {
        coordinates: convertSquareIdToPosition(squareId),
        boardId: board,
      },
    };
    actOnTurn(draggedPiece, targetSquare);
  }
}

export function onFallOffTheBoard(draggedElement: HTMLElement, board: string) {
  const draggedPiece: Piece | undefined = pieces.find((piece) => {
    const squareElement = draggedElement.parentElement;
    const squareId = squareElement?.getAttribute('square-id');
    if (!squareId) return;

    const draggedElementPosition: Position = {
      coordinates: convertSquareIdToPosition(squareId),
      boardId: board,
    };

    return comparePositions(
      draggedElementPosition,
      piece.position,
    );
  });

  if (!draggedPiece) return;
  if (!isAllowedToMove(draggedPiece)) return;

  permanentlyKillPiece(draggedPiece);
  fellOffTheBoardPiece = draggedPiece;

  endTurn();
}
