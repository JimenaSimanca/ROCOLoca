import type { Team } from './Team';
export type GameStatus = 'LOBBY' | 'PLAYING' | 'STEAL' | 'CARD' | 'FINAL' | 'FINISHED';
export interface GameSettings { targetScore:number; answerTime:number; stealTime:number; cardEveryTurns:number; teamCount:number; }
export interface GameState { roomCode:string; status:GameStatus; teams:Team[]; currentTeamIndex:number; direction:1|-1; round:number; turn:number; currentSongNumber:number; usedClues:string[]; currentPoints:number; stealChain:string[]; settings:GameSettings; }
