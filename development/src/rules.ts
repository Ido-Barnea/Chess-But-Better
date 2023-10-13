import {
    getCurrentPlayer,
    fellOffTheBoardPiece,
    deathCounter,
    isFirstKill,
    isPieceKilled,
    isFriendlyFire,
    roundCounter,
    players,
} from "./logic";
import { Logger } from "./logger";
import { destroyPieceOnBoard } from "./board";

class Rule {
    id: number;
    description: string;
    isRevealed: boolean;
    triggerCondition: () => boolean;
    triggerAction: () => void;

    constructor(
        id: number,
        description: string,
        isRevealed: boolean,
        triggerCondition: () => boolean,
        triggerAction: () => void,
    ) {
        this.id = id;
        this.description = description;
        this.isRevealed = isRevealed;
        this.triggerCondition = triggerCondition;
        this.triggerAction = triggerAction;
    }

    apply() {
        if (this.triggerCondition()) {
            this.triggerAction();
            if (!this.isRevealed) {
                const player = getCurrentPlayer();
                Logger.log(`${player.color} received XP for revealing a new rule: ${this.description}`);
                player.xp++;
                this.isRevealed = true;

                const rulesContainer = document.getElementById('rules-container');
                rulesContainer!.innerHTML += `<p>${this.id}) ${this.description}</p>`
            }
        }
    }
}

const inactiveRules = [];
export const activeRules = [
    new Rule(
        0,
        "Pieces can fall off the board.",
        true,
        () => {
            return fellOffTheBoardPiece ? true : false;
        },
        () => {
            Logger.log(`A ${fellOffTheBoardPiece!.player.color} ${fellOffTheBoardPiece!.name} fell off the board.`);
            destroyPieceOnBoard(fellOffTheBoardPiece!);
        }
    ),
    new Rule(
        1,
        "First Blood Bonus: The first to kill gets an extra XP.",
        true,
        () => {
            return deathCounter > 0 && isFirstKill;
        },
        () => {
            const player = getCurrentPlayer();
            Logger.log(`${player.color} has made First Blood and received a bonus.`);
            player.xp++;
        }
    ),
    new Rule(
        2,
        "Players gain XP on a kill.",
        true,
        () => {
            return isPieceKilled;
        },
        () => {
            const player = getCurrentPlayer();
            Logger.log(`${player.color} received XP for killing another piece.`);
            player.xp++;
        }
    ),
    new Rule(
        3,
        "Friendly Fire! Players can attack their own pieces (for a price).",
        true,
        () => {
            return isFriendlyFire;
        },
        () => {
            const player = getCurrentPlayer();
            Logger.log(`${player.color} attacked his own piece and has to pay compensations.`);
            player.gold--;
        }
    ),
    new Rule(
        4,
        "With age comes wisdom.",
        true,
        () => {
            return roundCounter === 20;
        },
        () => {
            Logger.log(`Children of war, you have grown old. Each player gains five XP.`);
            players.forEach((player) => {
                Logger.log(`${player.color} gained XP.`);
                player.xp += 5;
            });
        }
    ),
    new Rule(
        5,
        "Empty pockets.",
        true,
        () => {
            players.forEach((player) => {
                if (player === getCurrentPlayer() && player.gold < 0) {
                    return true;
                }
            });
            return false;
        },
        () => {
            players.forEach((player) => {
                if (player === getCurrentPlayer() && player.gold < 0) {
                    Logger.log(`${player.color} is in debt. They lose XP for not handling money properly.`);
                    player.xp--;
                    return;
                }
            });
        }
    )
];