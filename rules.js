class Rule {
    constructor(id, description, condition, action, isSecret) {
        this.id = id;
        this.description = description;
        this.condition = condition;
        this.action = action;
        this.isSecret = isSecret;
    }

    apply(board) {
        if (this.condition(board)) {
            this.action(board);
        }
    }
}

// Variables
let fellOffTheBoard;

// Rules lists
const inactiveRules = [];
const activeRules = [
    new Rule(
        0,
        "Pieces can fall off the board.",
        (board) => {
            return fellOffTheBoard != null;
        },
        (board) => {
            const color = fellOffTheBoard.classList.contains('white') ? 'white' : 'black';
            console.log('A ' + color + ' ' + fellOffTheBoard.id + ' fell off the board.');
            fellOffTheBoard.remove();
            fellOffTheBoard = null;
        },
        true
    )
];
