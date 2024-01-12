/* eslint-disable @typescript-eslint/no-empty-function */

import { Item } from '../logic/items/Items';
import { Piece } from '../logic/pieces/Pieces';
import { Square } from '../logic/pieces/PiecesHelpers';
import { BaseRule } from '../logic/rules/BaseRule';

export function renderScreen() {}

export function renderRules(_: BaseRule) {}

export function onActionTriggered(
  _draggedElement: HTMLElement,
  _targetElement: HTMLElement,
  _boardId: string,
) {}

export function onFellOffTheBoardTriggered(
  _draggedElement: HTMLElement,
  _boardId: string,
) {}

export function movePieceOnBoard(
  _draggedPiece: Piece,
  _targetSquare: Square,
) {}

export function destroyPieceOnBoard(_: Piece) {}

export function destroyItemOnBoard(_: Item) {}

export function spawnPieceOnBoard(_: Piece) {}

export function spawnItemOnBoard(_: Item) {}
