import {useEffect,useRef,useState} from 'react';
import {useParams} from 'react-router-dom';
import Logo from '../components/common/Logo';
import NeonCard from '../components/common/NeonCard';
import NeonButton from '../components/common/NeonButton';
import {connectRoom,send,type Player} from '../realtime/connection';
import type {GameState} from '../models/Game';
export default function JoinPage(){
 const {roomCode=''}=useParams();const [name,setName]=useState(sessionStorage.getItem('roco-name')||'');const [joined,setJoined]=useState(false);
 const [players,setPlayers]=useState<Player[]>([]);const [game,setGame]=useState<GameState|null>(null);const [error,setError]=useState('');const wsRef=useRef<WebSocket|null>(null);
 const join=()=>{if(!name.trim())return;sessionStorage.setItem('roco-name',name.trim());wsRef.current?.close();wsRef.current=connectRoom(roomCode,'player',m=>{if(m.type==='joined')setJoined(true);if(m.type==='state')setGame(m.game);if(m.type==='players')setPlayers(m.players);if(m.type==='error')setError(m.message);if(m.type==='host-offline')setError('El Host se ha desconectado.');},name.trim());if(!wsRef.current)setError('Falta configurar el servidor de tiempo real.');};
 useEffect(()=>()=>wsRef.current?.close(),[]);
 const me=players.find(p=>p.name===name&&p.connected);
 return <main className="screen screen--center"><Logo/><NeonCard className="settings-card"><h1>🎵 SALA {roomCode}</h1>
 {!joined?<><p>Escribe tu nombre para entrar a la partida</p><input value={name} maxLength={30} placeholder="Tu nombre" onChange={e=>setName(e.target.value)} /><NeonButton onClick={join}>UNIRME</NeonButton></>:
 <><h2>¡Bienvenido, {name}!</h2><p>{game?.status==='PLAYING'?'🎮 ¡La partida comenzó!':'⏳ Esperando al anfitrión...'}</p>
 {game&&<><h3>Selecciona tu equipo</h3><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{game.teams.map((t,i)=><NeonButton key={t.id} variant="blue" onClick={()=>send(wsRef.current,{type:'team',teamIndex:i})}>{t.icon} {t.name}</NeonButton>)}</div>
 <p>Equipo elegido: {me?.teamIndex===undefined?'Pendiente':game.teams[me.teamIndex]?.name}</p>
 <h3>🏆 Puntuaciones</h3>{game.teams.map(t=><p key={t.id}>{t.icon} {t.name}: {t.score} puntos</p>)}
 {game.status==='PLAYING'&&<p>Turno de {game.teams[game.currentTeamIndex]?.name} · Canción #{game.currentSongNumber}</p>}
 {game.status==='FINISHED'&&<h2>🏆 ¡Partida finalizada!</h2>}</>}
 </>}{error&&<p role="alert" style={{color:'#ffb05e'}}>{error}</p>}</NeonCard></main>;
}
