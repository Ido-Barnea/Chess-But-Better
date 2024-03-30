export interface Rule {
  description: string;
  isRevealed: boolean;
  condition: () => boolean;
  onTrigger: () => void;
  trigger: () => void;
}
