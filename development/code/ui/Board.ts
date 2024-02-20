import { game } from '../Game';
import { BOARD_WIDTH } from '../logic/Constants';
import { comparePositions } from '../logic/Utilities';
import { PiggyBank } from '../logic/items/PiggyBank';
import { Item } from '../logic/items/Items';
import { Piece } from '../logic/pieces/Piece';
import { Position } from '../logic/pieces/PiecesUtilities';
import { initializeDraggingListeners } from './Events';

export class ChessBoard {
  boardId: string;
  boardElement: HTMLElement;
  boardButtonElement: HTMLElement;
  lightSquareColor: string;
  darkSquareColor: string;

  constructor(
    boardId: string,
    boardElement: HTMLElement,
    boardButtonElement: HTMLElement,
    lightSquareColor: string,
    darkSquareColor: string,
  ) {
    this.boardId = boardId;
    this.boardElement = boardElement;
    this.boardButtonElement = boardButtonElement;
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
      game.getPieces().forEach((piece) => {
        const pieceElement = this.createPieceElement(piece);
        const square = document.querySelectorAll(`[square-id="${piece.position.coordinates}"]`)[0];
        square.appendChild(pieceElement);
      });
    }

    this.randomlyGeneratePiggyBanks();
  }

  createSquare(coordinates: [number, number]) {
    const squareElement = document.createElement('div');
    squareElement.classList.add('square');
    squareElement.setAttribute('square-id', coordinates.join(','));

    const backgroundColor = this.getBackgroundColor(coordinates);
    squareElement.classList.add(backgroundColor);

    this.boardElement.appendChild(squareElement);
  }

  generatePiggyBankAtPosition(position: Position) {
    const coin = new PiggyBank(position);
    game.getItems().push(coin);

    const coinElement = this.createItemElement(coin);
    const square = this.boardElement.querySelectorAll(`[square-id="${position.coordinates}"]`)[0];
    square.appendChild(coinElement);
  }

  randomlyGeneratePiggyBanks() {
    let generatedPiggyBank = false;
    for (let row = 0; row < BOARD_WIDTH; row++) {
      for (let column = 0; column < BOARD_WIDTH; column++) {
        // A number between 1-100 that determines the chance of a coin generating on any square.
        const COIN_GENERATION_CHANCE = 5;
        const random = Math.floor(Math.random() * 100) + 1;

        const coordinates: [number, number] = [column, row];
        const currentPosition: Position = {
          coordinates: coordinates,
          boardId: this.boardId,
        };
        const isPieceOnTargetSquare: boolean = (game.getPieces().filter(piece => {
          return comparePositions(currentPosition, piece.position);
        })).length !== 0;
        if (random < COIN_GENERATION_CHANCE && !isPieceOnTargetSquare) {
          const position: Position = {
            coordinates: coordinates,
            boardId: this.boardId,
          };
          this.generatePiggyBankAtPosition(position);
          generatedPiggyBank = true;
        }
      }
    }

    if (!generatedPiggyBank) {
      // If no piggy banks were generated, generate one at the center of the board.
      const squarePositionX = Math.floor(Math.random() * 4) + 2;
      const squarePositionY = Math.floor(Math.random() * 4) + 2;

      const position: Position = {
        coordinates: [squarePositionX, squarePositionY],
        boardId: this.boardId,
      };
      this.generatePiggyBankAtPosition(position);
    }
  }

  getBackgroundColor(position: [number, number]) {
    const isEvenColumn = position[0] % 2 === 0;
    const isEvenRow = position[1] % 2 === 0;

    if (isEvenRow) {
      return isEvenColumn ? this.lightSquareColor : this.darkSquareColor;
    } else {
      return isEvenColumn ? this.darkSquareColor : this.lightSquareColor;
    }
  }

  createPieceElement(piece: Piece): HTMLElement {
    const pieceElement = document.createElement('div');
    pieceElement.classList.add('piece');
    pieceElement.setAttribute('draggable', 'true');
    pieceElement.setAttribute('id', piece.name);

    pieceElement.classList.add(piece.player.color.toLowerCase());

    pieceElement.innerHTML = piece.resource;

    initializeDraggingListeners(pieceElement);

    return pieceElement;
  }

  createItemElement(item: Item): HTMLElement {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.setAttribute('id', item.name);

    itemElement.innerHTML = item.resource;

    return itemElement;
  }

  moveElementOnBoard(
    element: HTMLElement,
    targetSquareElement: HTMLElement,
  ) {
    targetSquareElement.appendChild(element);

    // Calculate the center position of the square
    const centerX = (targetSquareElement.clientWidth - element.clientWidth) / 2;
    const centerY = (targetSquareElement.clientHeight - element.clientHeight) / 2;

    // Set the moved elemenet's position
    element.style.left = centerX + 'px';
    element.style.top = centerY + 'px';
  }

  destroyElementOnBoard(element: HTMLElement) {
    element.remove();
  }

  spawnElementOnBoard(element: HTMLElement, parentElement: HTMLElement) {
    parentElement.appendChild(element);
  }

  spawnItemOnBoard(item: Item) {
    if (!item.position) return;
    
    const itemCoordinates = item.position.coordinates;
    const square = this.boardElement.querySelectorAll(`[square-id="${itemCoordinates}"]`)[0];

    const itemElement = this.createItemElement(item);
    square.appendChild(itemElement);
  }
}
