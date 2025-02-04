export class PieceHealth {
  currentHealth: number;
  maxHealth: number;

  constructor(initialHealth: number, maxHealth: number) {
    this.currentHealth = initialHealth;
    this.maxHealth = maxHealth;
  }

  restoreHealth(amount: number) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }

  damage(amount: number) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }

  isDead(): boolean {
    return this.currentHealth <= 0;
  }
}