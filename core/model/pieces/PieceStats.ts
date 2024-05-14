export class PieceStats {
  constructor(
    public moves: number,
    public health: number,
    public price: number,
    public isEquippedItem = false,
  ) {}
}
