import { Logger } from "./logger";
import { initializeEventListeners, setOnAction, setOnFallOffTheBoard } from "./events";
import { initializeBoard } from "./board";
import { onAction, onFallOffTheBoard, getCurrentPlayer } from "./logic";
import { Player } from "./players";

const playerDisplay = document.querySelector('#player-display')!;
const roundCounterDisplay = document.querySelector('#round-counter-display')!;
const infoDisplay = document.querySelector('#info-display')!;

export function updateUI(player, roundCounter, ) {
    playerDisplay!.textContent = player.color;
    roundCounterDisplay!.textContent = roundCounter;
}

export function updatePlayersInformation(players: Array<Player>, roundCounter: number) {
    infoDisplay.textContent = '';
    infoDisplay.textContent += `Round: ${roundCounter}`;
    infoDisplay.textContent += 'Players:';
    players.forEach((player) => {
        infoDisplay.textContent += `${getCurrentPlayer() === player ? '> ' : ''} ${player.color} Player: ${player.xp} XP; ${player.gold} Gold.`;
    });
}

function initializeGame() {
    Logger.log('Game started!');
    initializeBoard();
    initializeEventListeners();
    setOnAction(onAction);
    setOnFallOffTheBoard(onFallOffTheBoard);
}

initializeGame();