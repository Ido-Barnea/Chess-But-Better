import { Logger } from "./logger";
import {
  initializeEventListeners,
  setOnAction,
  setOnFallOffTheBoard,
} from "./events";
import { initializeBoard } from "./board";
import { initializeHellBoard } from "./board_hell";
import { initializeHeavenBoard } from "./board_heaven";
import {
  onAction,
  onFallOffTheBoard,
  getCurrentPlayer,
  players,
  roundCounter,
} from "./logic";
import { Rule } from "./rules";

const infoDisplay = document.getElementById("info-display")!;
const rulesContainer = document.getElementById("rules-container")!;

export function updatePlayersInformation() {
  infoDisplay.textContent = "";

  const roundElement = document.createElement("p");
  roundElement.innerHTML = `<b>Round:</b> ${roundCounter}`;
  infoDisplay.appendChild(roundElement);

  const playersElement = document.createElement("p");
  playersElement.innerHTML = "<b>Players:</b>";

  players.forEach((player) => {
    const playerInformationElement = document.createElement("p");
    const isCurrentPlayer = getCurrentPlayer() === player;
    const title = `${isCurrentPlayer ? "> " : ""} ${player.color} Player:`;
    playerInformationElement.innerHTML = `${
      isCurrentPlayer ? "<b>" : ""
    }${title}${isCurrentPlayer ? "</b>" : ""} ${player.xp} XP; ${
      player.gold
    } Gold.`;
    playersElement.appendChild(playerInformationElement);
  });

  infoDisplay.appendChild(playersElement);
}

export function updateRules(rule: Rule) {
  const ruleElement = document.createElement("p");
  ruleElement.innerHTML = `<b>${rule.id}) ${rule.description}</b>`;
  rulesContainer.appendChild(ruleElement);
}

function initializeGame() {
  Logger.log("Game started!");
  initializeBoard();
  initializeHellBoard();
  initializeHeavenBoard();
  initializeEventListeners();
  updatePlayersInformation();
  setOnAction(onAction);
  setOnFallOffTheBoard(onFallOffTheBoard);
}

initializeGame();
