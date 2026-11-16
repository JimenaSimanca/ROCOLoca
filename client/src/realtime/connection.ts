export type Player = {id:string;name:string;connected:boolean;teamIndex?:number};
export const wsUrl = import.meta.env.VITE_REALTIME_URL || '';
export function connectRoom(code:string,role:'host'|'player',onMessage:(m:any)=>void,name?:string){
 if(!wsUrl)return null;
 const ws=new WebSocket(wsUrl);
 ws.onopen=()=>ws.send(JSON.stringify({type:role,code,name,playerId:role==='player'?getPlayerId():undefined}));
 ws.onmessage=e=>{try{onMessage(JSON.parse(e.data))}catch{}};
 return ws;
}
export function getPlayerId(){let id=sessionStorage.getItem('roco-player-id');if(!id){id=crypto.randomUUID();sessionStorage.setItem('roco-player-id',id);}return id;}
export function send(ws:WebSocket|null,m:object){if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify(m));}
