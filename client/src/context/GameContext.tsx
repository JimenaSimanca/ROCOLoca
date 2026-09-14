import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GameSettings, GameState } from '../models/Game';
import { mockTeams } from '../data/mockTeams';

type Value={game:GameState;createGame:(s:GameSettings)=>string;startGame:()=>void;nextTurn:()=>void;spinRoulette:()=>string;addPointsToCurrentTeam:(p?:number)=>void;resetDemo:()=>void};
const initialState:GameState={roomCode:'RCL428',status:'LOBBY',teams:mockTeams,currentTeamIndex:0,direction:1,round:1,turn:1,currentSongNumber:1,usedClues:[],currentPoints:5,stealChain:[],settings:{targetScore:15,answerTime:10,stealTime:3,cardEveryTurns:3,teamCount:4}};
const Ctx=createContext<Value|undefined>(undefined);
const clues=['📅 AÑO','🎤 ARTISTA','💬 PALABRA / FRASE','🎬 IMAGEN / VIDEO','🎧 AUDIO','🔎 PISTA ESPECIAL'];
const code=()=>`RCL${Math.floor(100+Math.random()*900)}`;
export function GameProvider({children}:{children:ReactNode}){
 const [game,setGame]=useState<GameState>(initialState);
 const createGame=(settings:GameSettings)=>{const roomCode=code();setGame(p=>({...p,roomCode,status:'LOBBY',settings,teams:mockTeams.slice(0,settings.teamCount).map(t=>({...t,score:0})),currentTeamIndex:0,round:1,turn:1,currentSongNumber:1,usedClues:[],currentPoints:5}));return roomCode};
 const startGame=()=>setGame(p=>({...p,status:'PLAYING'}));
 const nextTurn=()=>setGame(p=>{const ni=(p.currentTeamIndex+p.direction+p.teams.length)%p.teams.length;return {...p,currentTeamIndex:ni,turn:p.turn+1,round:(ni===0&&p.direction===1)?p.round+1:p.round,currentSongNumber:p.currentSongNumber+1,usedClues:[],currentPoints:5}});
 const spinRoulette=()=>{const clue=clues[Math.floor(Math.random()*clues.length)];setGame(p=>{const u=[...p.usedClues,clue];return {...p,usedClues:u,currentPoints:Math.max(1,6-u.length)}});return clue};
 const addPointsToCurrentTeam=(points?:number)=>setGame(p=>({...p,teams:p.teams.map((t,i)=>i===p.currentTeamIndex?{...t,score:t.score+(points??p.currentPoints)}:t)}));
 const resetDemo=()=>setGame(initialState);
 const value=useMemo(()=>({game,createGame,startGame,nextTurn,spinRoulette,addPointsToCurrentTeam,resetDemo}),[game]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useGame(){const c=useContext(Ctx);if(!c) throw new Error('useGame debe usarse dentro de GameProvider');return c}
