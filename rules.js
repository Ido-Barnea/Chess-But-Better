class Rule {
    constructor(id, description, isSecret, condition, action) {
        this.id = id;
        this.description = description;
        this.isSecret = isSecret;
        this.condition = condition;
        this.action = action;
    }

    apply(board) {
        if (this.condition(board)) {
            this.action(board);
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
        (board) => {
            return fellOffTheBoard != null;
        },
        (board) => {
            const color = fellOffTheBoard.classList.contains('white') ? 'white' : 'black';
            console.log(`A ${color} ${fellOffTheBoard.id} fell off the board.`);
            fellOffTheBoard.remove();
            fellOffTheBoard = null;
            this.isSecret = false;
        }
    ),
    new Rule(
        1,
        "First Blood Bonus: The first to kill gets an extra XP.",
        true,
        (board) => {
            return deathCounter > 0 && isFirstKill;
        },
        (board) => {
            players.forEach((player) => {
                if (player.color === currentPlayer) {
                    player.xp += 1;
                    console.log(`${currentPlayer} has made First Blood and received a bonus.`);
                }
            });
            isFirstKill = false;
            this.isSecret = false;
        }
    ),
    new Rule(
        2,
        "Players gain XP on a kill.",
        true,
        (board) => {
            return deathTrigger;
        },
        (board) => {
            players.forEach((player) => {
                if (player.color === currentPlayer) {
                    player.xp += 1;
                    console.log(`${currentPlayer} received a bonus for killing another piece.`);
                }
            });
            deathTrigger = false;
            this.isSecret = false;
        }
    ),
    new Rule(
        2,
        "Friendly Fire! Players can attack their own pieces.",
        true,
        (board) => {
            return isFriendlyFire;
        },
        (board) => {
            players.forEach((player) => {
                if (player.color === currentPlayer) {
                    player.gold -= 1;
                    console.log(`${currentPlayer} attacked his own piece and has to pay compensations.`);
                }
            });
            isFriendlyFire = false;
            this.isSecret = false;
        }
    )
];
