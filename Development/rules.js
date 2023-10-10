class Rule {
    constructor(id, description, isSecret, condition, action) {
        this.id = id;
        this.description = description;
        this.isSecret = isSecret;
        this.condition = condition;
        this.action = action;
    }

    apply() {
        if (this.condition()) {
            this.action();
            if (this.isSecret) {
                const player = getCurrentPlayer();
                Logger.log(`${player.color} received XP for revealing a new rule: ${this.description}`);
                player.xp++;
                this.isSecret = false;
            }
        }
    }
}

// Variables
let fellOffTheBoard;

let isFirstKill = true;
let deathCounter = 0;
let deathTrigger = false;

let isFriendlyFire = false;

// Rules lists
const inactiveRules = [];
const activeRules = [
    new Rule(
        0,
        "Pieces can fall off the board.",
        true,
        () => {
            return fellOffTheBoard != null;
        },
        () => {
            const color = fellOffTheBoard.classList.contains('white') ? 'white' : 'black';
            Logger.log(`A ${color} ${fellOffTheBoard.id} fell off the board.`);
            fellOffTheBoard.remove();
            fellOffTheBoard = null;
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
            isFirstKill = false;
        }
    ),
    new Rule(
        2,
        "Players gain XP on a kill.",
        true,
        () => {
            return deathTrigger;
        },
        () => {
            const player = getCurrentPlayer();
            Logger.log(`${player.color} received XP for killing another piece.`);
            player.xp++;
            deathTrigger = false;
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
            isFriendlyFire = false;
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
            Logger.log(`Children of war, you have grown old. Each player gains XP.`);
            players.forEach((player) => {
                Logger.log(`${player.color} gained XP.`);
                player.xp++;
            });
        }
    ),
    new Rule(
        5,
        "Empty pockets.",
        true,
        () => {
            let isInDebt = false;
            players.forEach((player) => {
                if (player === players[currentPlayerIndex] && player.gold < 0) {
                    isInDebt = true;
                }
            });
            return isInDebt;
        },
        () => {
            players.forEach((player) => {
                if (player === players[currentPlayerIndex] && player.gold < 0) {
                    Logger.log(`${player.color} is in debt. They lose XP for not handling money properly.`);
                    player.xp--;
                }
            });
        }
    )
];

function getCurrentPlayer() {
    let player = null;
    players.forEach((_player) => {
        if (_player === players[currentPlayerIndex]) {
            player = _player;
        }
    });

    return player;
}
