import { Logger } from "./logger";
import { initializeEventListeners, setOnAction, setOnFallOffTheBoard } from "./events";
import { initializeBoard } from "./board";
import { onAction, onFallOffTheBoard, getCurrentPlayer, players, roundCounter } from "./logic";

const infoDisplay = document.querySelector('#info-display')!;

export function updatePlayersInformation() {
    infoDisplay.textContent = '';

    const roundElement = document.createElement('p');
    roundElement.innerHTML = `<b>Round:</b> ${roundCounter}`
    infoDisplay.appendChild(roundElement);

    const playersElement = document.createElement('p');
    playersElement.innerHTML = '<b>Players:</b>';

    players.forEach((player) => {
        const playerInformationElement = document.createElement('p');
        const isCurrentPlayer = getCurrentPlayer() === player;
        const title = `${isCurrentPlayer ? '> ' : ''} ${player.color} Player:`;
        playerInformationElement.innerHTML = `${isCurrentPlayer ? '<b>' : ''}${title}${isCurrentPlayer ? '</b>' : ''} ${player.xp} XP; ${player.gold} Gold.`;
        playersElement.appendChild(playerInformationElement);
    });

    infoDisplay.appendChild(playersElement);
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