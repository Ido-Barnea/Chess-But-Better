import { Player, PlayerColors } from '../Players';

export const whitePlayer = new Player(PlayerColors.WHITE);
export const items = [];

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function switchIsCastling() {}

export function getCurrentPlayer() {
  return whitePlayer;
}
