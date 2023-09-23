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
let hasAnyoneDied = false;

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
        "First Blood Bonus: The first to kill gets 2 XP.",
        true,
        (board) => {
            return hasAnyoneDied && isFirstKill;
        },
        (board) => {
            players.forEach((player) => {
                if (player.color === currentPlayer) {
                    player.xp += 2;
                    console.log(`${currentPlayer} has made First Blood and received a bonus.`);
                }
            });
            isFirstKill = false;
            this.isSecret = false;
        }
    )
];
