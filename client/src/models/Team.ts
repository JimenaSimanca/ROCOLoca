export interface Team {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  icon: string;
  skipNextTurn: boolean;
  doublePoints: boolean;
  shield: boolean;
}
