import { Logger } from "./logger";
import { Piece } from "./pieces";
import { Player } from "./players";

export class Inventory {
    items: Array<Item> = [];

    addItem(item: Item, player: Player) {
        this.items.push(item);
        Logger.log(`${player.color} received a ${item.name}.`);
    }

    removeItem(item: Item) {
        const index = this.items.indexOf(item);
        delete this.items[index];
        Logger.log(`${item.name} was destroyed.`);
    }
}

interface ItemType {
    name: string,
    apply: (player: Player) => void;
}

export class Item implements ItemType {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    apply(_: Player) {

    }
}

export class Corpse extends Item {
    piece: Piece;

    constructor(piece: Piece) {
        super(`${piece.player.color} ${piece.name} corpse`);
        this.piece = piece;
    }

    apply(player: Player) {
        Logger.log(`${player.color} touched a ${this.name}. I'm pretty sure that's NOT politicly correct.`);
    }
}
