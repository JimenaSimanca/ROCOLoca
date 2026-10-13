import {createContext,useContext,useMemo,useState,type ReactNode} from 'react';
import type {GameSettings,GameState} from '../models/Game';
import {mockTeams} from '../data/mockTeams';
import {songs} from '../data/songs';
import {cards} from '../data/cards';
type Value={game:GameState;createGame:(s:GameSettings)=>string;startGame:()=>void;nextTurn:()=>void;spinRoulette:()=>string;addPointsToCurrentTeam:(p?:number)=>void;awardTeam:(index:number,points:number)=>void;applyCard:(kind:string,target?:number)=>void;changeSong:()=>void;resetDemo:()=>void};
const clues=['AÑO','ARTISTA','PALABRA','GÉNERO','PISTA ESPECIAL'];
const initialState:GameState={roomCode:'RCL428',status:'LOBBY',teams:mockTeams,currentTeamIndex:0,direction:1,round:1,turn:1,currentSongNumber:1,usedClues:[],currentPoints:5,stealChain:[],settings:{targetScore:15,answerTime:10,stealTime:3,cardEveryTurns:3,teamCount:4}};
const Ctx=createContext<Value|undefined>(undefined);
const code=()=>`RCL${Math.floor(100+Math.random()*900)}`;
export function GameProvider({children}:{children:ReactNode}){
 const [game,setGame]=useState<GameState>(initialState);
 const createGame=(settings:GameSettings)=>{const roomCode=code();setGame({...initialState,roomCode,settings,teams:mockTeams.slice(0,settings.teamCount).map(t=>({...t,score:0}))});return roomCode};
 const startGame=()=>setGame(p=>({...p,status:'PLAYING'}));
 const nextTurn=()=>setGame(p=>{let ni=(p.currentTeamIndex+p.direction+p.teams.length)%p.teams.length;let teams=p.teams.map(t=>({...t}));let tries=0;while(teams[ni].skipNextTurn&&tries<teams.length){teams[ni].skipNextTurn=false;ni=(ni+p.direction+teams.length)%teams.length;tries++}return {...p,teams,currentTeamIndex:ni,turn:p.turn+1,round:p.round+(ni===0?1:0),currentSongNumber:p.currentSongNumber+1,usedClues:[],currentPoints:5,status:p.status==='FINAL'?'FINISHED':p.status==='FINISHED'?'FINISHED':p.status==='PLAYING'?'PLAYING':p.status}});
 const spinRoulette=()=>{const available=clues.filter(c=>!game.usedClues.includes(c));if(!available.length)return 'SIN PISTAS';const clue=available[Math.floor(Math.random()*available.length)];setGame(p=>({...p,usedClues:[...p.usedClues,clue],currentPoints:Math.max(1,5-p.usedClues.length)}));return clue};
 const awardTeam=(index:number,points:number)=>setGame(p=>{if(p.status==='FINISHED')return p;const teams=p.teams.map((t,i)=>i===index?{...t,score:t.score+points,doublePoints:false}:t);return {...p,teams,status:teams.some(t=>t.score>=p.settings.targetScore)&&p.status==='PLAYING'?'FINAL':p.status}});
 const addPointsToCurrentTeam=(points?:number)=>awardTeam(game.currentTeamIndex,(points??game.currentPoints)*(game.teams[game.currentTeamIndex].doublePoints?2:1));
 const changeSong=()=>setGame(p=>({...p,currentSongNumber:p.currentSongNumber+1,usedClues:[],currentPoints:5}));
 const applyCard=(kind:string,target?:number)=>{if(kind==='change'){changeSong();return}if(kind==='dance')return;setGame(p=>({...p,direction:kind==='reverse'?(p.direction===1?-1:1):p.direction,teams:p.teams.map((t,i)=>({...t,score:kind==='plus'&&i===p.currentTeamIndex?t.score+2:kind==='minus'&&i===target?Math.max(0,t.score-2):t.score,skipNextTurn:kind==='skip'&&i===target?true:t.skipNextTurn,doublePoints:kind==='double'&&i===p.currentTeamIndex?true:t.doublePoints}))}))};
 const resetDemo=()=>setGame(initialState);
 const value=useMemo(()=>({game,createGame,startGame,nextTurn,spinRoulette,addPointsToCurrentTeam,awardTeam,applyCard,changeSong,resetDemo}),[game]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useGame(){const c=useContext(Ctx);if(!c)throw new Error('useGame requiere GameProvider');return c}
export {songs,cards};
