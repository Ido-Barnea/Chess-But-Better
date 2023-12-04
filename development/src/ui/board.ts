import { BOARD_WIDTH } from '../logic/constants';
import { Item } from '../logic/items';
import { pieces } from '../logic/logic';
import { Piece, Square } from '../logic/pieces';

interface ChessBoardType {
  boardElement: HTMLElement;
  boardButton?: HTMLElement;
  lightSquareColor: string;
  darkSquareColor: string;
}
export class ChessBoard implements ChessBoardType {
  boardElement: HTMLElement;
  lightSquareColor: string;
  darkSquareColor: string;

  constructor(
    boardContainer: HTMLElement,
    lightSquareColor: string,
    darkSquareColor: string,
  ) {
    this.boardElement = boardContainer;
    this.darkSquareColor = darkSquareColor;
    this.lightSquareColor = lightSquareColor;

    this.initializeBoard();
  }

  initializeBoard() {
    for (let row = 0; row < BOARD_WIDTH; row++) {
      for (let column = 0; column < BOARD_WIDTH; column++) {
        this.createSquare([column, row]);
      }
    }


    const isCollapsed = this.boardElement.classList.contains('collapsed');
    if (!isCollapsed) {
      pieces.forEach((piece) => {
        const pieceElement = this.createPieceElement(piece);
        const square = document.querySelectorAll(
          `[square-id="${piece.position.coordinates}"]`,
        )[0];
        square.appendChild(pieceElement);
      });
    }
  }

  createSquare(position: [number, number]) {
    const squareElement = document.createElement('div');
    squareElement.classList.add('square');
    squareElement.setAttribute('square-id', position.join(','));

    const backgroundColor = this.getBackgroundColor(position);
    squareElement.classList.add(backgroundColor);

    this.boardElement.appendChild(squareElement);
  }


  getBackgroundColor(position: [number, number]) {
    const isEvenColumn = position[0] % 2 === 0;
    const isEvenRow = position[1] % 2 === 0;
    return isEvenRow
      ? isEvenColumn
        ? this.lightSquareColor
        : this.darkSquareColor
      : isEvenColumn
        ? this.darkSquareColor
        : this.lightSquareColor;
  }

  createPieceElement(piece: Piece): HTMLElement {
    const pieceElement = document.createElement('div');
    pieceElement.classList.add('piece');
    pieceElement.setAttribute('draggable', 'true');
    pieceElement.setAttribute('id', piece.name);

    pieceElement.classList.add(piece.player.color.toLowerCase());

    pieceElement.innerHTML = piece.resource;

    return pieceElement;
  }

  createItemElement(item: Item): HTMLElement {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.setAttribute('id', item.name);

    itemElement.classList.add(item.player.color.toLowerCase());

    itemElement.innerHTML = item.resource;

    return itemElement;
  }

  movePieceOnBoard(draggedPiece: Piece, targetSquare: Square) {
    const draggedPieceSquareElement = this.boardElement.querySelector(
      `[square-id="${draggedPiece.position.coordinates.join(',')}"]`,
    ) as HTMLElement;
    const draggedPieceElement =
      draggedPieceSquareElement?.firstElementChild as HTMLElement;

    const targetSquareElement = this.boardElement.querySelector(
      `[square-id="${targetSquare.position.coordinates.join(',')}"]`,
    ) as HTMLElement;

    targetSquareElement.appendChild(draggedPieceElement);
  }

  destroyPieceOnBoard(targetPiece: Piece) {
    const targetPieceSquareElement = this.boardElement.querySelector(
      `[square-id="${targetPiece.position.coordinates.join(',')}"]`,
    );
    const targetPieceElement =
      targetPieceSquareElement?.firstElementChild as HTMLElement;

    targetPieceElement.remove();
  }

  destroyItemOnBoard(targetItem: Item) {
    const targetItemSquareElement = this.boardElement.querySelector(
      `[square-id="${targetItem.position.coordinates?.join(',')}"]`,
    );
    const targetItemElement =
      targetItemSquareElement?.firstElementChild as HTMLElement;

    targetItemElement.remove();
  }

  spawnPieceOnBoard(piece: Piece) {
    const pieceElement = this.createPieceElement(piece);
    const square = this.boardElement.querySelectorAll(
      `[square-id="${piece.position.coordinates}"]`,
    )[0];
    square.appendChild(pieceElement);
  }

  spawnItemOnBoard(item: Item) {
    const itemElement = this.createItemElement(item);
    const square = this.boardElement.querySelectorAll(
      `[square-id="${item.position.coordinates}"]`,
    )[0];
    square.appendChild(itemElement);
  }
}
