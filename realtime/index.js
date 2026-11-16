import { WebSocketServer, WebSocket } from 'ws';
import http from 'node:http';
const rooms = new Map();
const port = Number(process.env.PORT || 3001);
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify({ok:true,rooms:rooms.size}));});
const wss = new WebSocketServer({server});
function send(ws,data){if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify(data));}
function broadcast(room,data){for(const ws of room.clients)send(ws,data);}
wss.on('connection',ws=>{
 let current=null,role=null,playerId=null;
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return}const code=String(m.code||'').toUpperCase().slice(0,12);
 if(m.type==='host'){if(!code)return;let room=rooms.get(code);if(!room){room={clients:new Set(),host:null,players:[],game:null};rooms.set(code,room)}if(room.host&&room.host!==ws&&room.host.readyState===WebSocket.OPEN){send(ws,{type:'error',message:'Ya existe un anfitrión conectado.'});return;}room.host=ws;room.clients.add(ws);current=code;role='host';send(ws,{type:'players',players:room.players});if(room.game)send(ws,{type:'state',game:room.game});return;}
 if(m.type==='observe'){const room=rooms.get(code);if(!room){send(ws,{type:'error',message:'Sala no encontrada'});return;}room.clients.add(ws);current=code;role='observer';send(ws,{type:'players',players:room.players});if(room.game)send(ws,{type:'state',game:room.game});return;}
 if(m.type==='join'){const room=rooms.get(code);if(!room){send(ws,{type:'error',message:'Sala no encontrada. Pide al Host que abra la sala.'});return;}const name=String(m.name||'').trim().slice(0,30);if(!name)return;playerId=String(m.playerId||'').slice(0,80)||Math.random().toString(36).slice(2);const old=room.players.find(p=>p.id===playerId);if(old){old.name=name;old.connected=true;}else room.players.push({id:playerId,name,connected:true});room.clients.add(ws);current=code;role='player';send(ws,{type:'joined',code,playerId});if(room.game)send(ws,{type:'state',game:room.game});broadcast(room,{type:'players',players:room.players});return;}
 if(!current)return;const room=rooms.get(current);if(!room)return;
 if(m.type==='state'&&role==='host'&&m.game&&typeof m.game==='object'){room.game=m.game;broadcast(room,{type:'state',game:room.game});}
 if(m.type==='team'&&role==='player'){const teamIndex=Number(m.teamIndex);if(Number.isInteger(teamIndex)&&teamIndex>=0&&teamIndex<8){const p=room.players.find(p=>p.id===playerId);if(p){p.teamIndex=teamIndex;broadcast(room,{type:'players',players:room.players});}}}
 });
 ws.on('close',()=>{if(!current)return;const room=rooms.get(current);if(!room)return;room.clients.delete(ws);if(role==='host'){room.host=null;broadcast(room,{type:'host-offline'});}else{const p=room.players.find(p=>p.id===playerId);if(p){p.connected=false;broadcast(room,{type:'players',players:room.players});}}if(room.clients.size===0)rooms.delete(current);});
});
server.listen(port,'0.0.0.0',()=>console.log(`ROCOLoca realtime on ${port}`));
