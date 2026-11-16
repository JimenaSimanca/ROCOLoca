import {useEffect,useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import Logo from '../components/common/Logo';
import NeonButton from '../components/common/NeonButton';
import NeonCard from '../components/common/NeonCard';
import TeamSlot from '../components/lobby/TeamSlot';
import {useGame} from '../context/GameContext';
import {type Player} from '../realtime/connection';
export default function HostLobbyPage(){
 const n=useNavigate();const {roomCode}=useParams();const {game,startGame}=useGame();const code=roomCode??game.roomCode;
 const [players,setPlayers]=useState<Player[]>([]);
 // Host receives player roster on a separate read-only connection using the same host connection lifecycle.
 useEffect(()=>{if(!import.meta.env.VITE_REALTIME_URL)return;const ws=new WebSocket(import.meta.env.VITE_REALTIME_URL);ws.onopen=()=>ws.send(JSON.stringify({type:'observe',code}));ws.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.type==='players')setPlayers(m.players)}catch{}};return()=>ws.close()},[code]);
 const url=`${window.location.origin}/join/${encodeURIComponent(code)}`;
 const qr=`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(url)}`;
 const begin=()=>{startGame();n(`/host/game/${code}`)};
 return <main className="screen"><header className="topbar"><Logo compact/><div className="room-chip">SALA {code}</div></header>
 <div className="lobby-layout"><NeonCard className="join-panel"><h1>ÚNETE A ROCOLOCA</h1>
 <img src={qr} alt={`Código QR para entrar a la sala ${code}`} width="240" height="240" style={{background:'white',padding:10,borderRadius:14,maxWidth:'100%'}}/>
 <p>Escanea el QR desde tu celular o abre este enlace:</p><a href={url} target="_blank" rel="noreferrer" style={{overflowWrap:'anywhere'}}>{url}</a>
 <div className="room-code">{code}</div><NeonButton variant="blue" onClick={()=>navigator.clipboard.writeText(url)}>📋 COPIAR ENLACE</NeonButton>
 {!import.meta.env.VITE_REALTIME_URL&&<p style={{color:'#ffcf63'}}>⚠ Configura VITE_REALTIME_URL para habilitar la conexión entre dispositivos.</p>}
 </NeonCard><section><h2 className="section-title">EQUIPOS</h2><div className="team-grid">{game.teams.map(t=><TeamSlot key={t.id} team={t}/>)}</div>
 <h3>Jugadores conectados ({players.filter(p=>p.connected).length})</h3><ul>{players.map(p=><li key={p.id}>{p.connected?'🟢':'⚪'} {p.name} {p.teamIndex!==undefined?`· Equipo ${p.teamIndex+1}`:''}</li>)}</ul>
 <div className="lobby-actions"><span>{game.teams.length} equipos</span><NeonButton onClick={begin}>▶ COMENZAR PARTIDA</NeonButton></div></section></div></main>;
}
