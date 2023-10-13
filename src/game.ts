import { Logger } from "./logger";
import { initializeEventListeners, setOnAction, setOnFallOffTheBoard } from "./events";
import { initializeBoard } from "./board";
import { onAction, onFallOffTheBoard, getCurrentPlayer, players, roundCounter } from "./logic";

const infoDisplay = document.querySelector('#info-display')!;

export function updatePlayersInformation() {
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
    updatePlayersInformation();
    setOnAction(onAction);
    setOnFallOffTheBoard(onFallOffTheBoard);
}

initializeGame();