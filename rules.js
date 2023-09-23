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
            if (this.isSecret) {
                console.log(`${currentPlayer} received XP for revealing a new rule: ${this.description}`);
                gainXP();
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
            console.log(`${currentPlayer} has made First Blood and received a bonus.`);
            gainXP();
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
            console.log(`${currentPlayer} received XP for killing another piece.`);
            gainXP();
            deathTrigger = false;
            this.isSecret = false;
        }
    ),
    new Rule(
        3,
        "Friendly Fire! Players can attack their own pieces (for a price).",
        true,
        (board) => {
            return isFriendlyFire;
        },
        (board) => {
            console.log(`${currentPlayer} attacked his own piece and has to pay compensations.`);
            const _player = getCurrentPlayer();
            _player.gold -= 1;
            isFriendlyFire = false;
            this.isSecret = false;
        }
    )
];

function getCurrentPlayer() {
    let player = null;
    players.forEach((_player) => {
        if (_player.color === currentPlayer) {
            player = _player;
        }
    });

    return player;
}

function gainXP() {
    const _player = getCurrentPlayer();
    _player.xp += 1;
}
