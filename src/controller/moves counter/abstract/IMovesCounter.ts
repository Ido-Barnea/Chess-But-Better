export interface IMovesCounter {
  getRemainingMovesCount(): number;
  setRemainingMovesCount(count: number): void;
  decreaseRemainingMovesCount(): void;
  resetRemainingMovesCount(): void;
}