export interface IRule {
  description: string;
  isRevealed: boolean;
  condition: () => boolean;
  onTrigger: () => void;
  trigger: () => void;
}
