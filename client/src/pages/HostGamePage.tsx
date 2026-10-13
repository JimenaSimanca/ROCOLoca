import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import NeonButton from "../components/common/NeonButton";
import NeonCard from "../components/common/NeonCard";
import ScoreBoard from "../components/game/ScoreBoard";
import Roulette from "../components/game/Roulette";
import SongPlayer from "../components/game/SongPlayer";
import { useGame, songs, cards } from "../context/GameContext";
const clueText = (key: string, s: (typeof songs)[number]) =>
  (
    ({
      AÑO: String(s.year),
      ARTISTA: s.artist,
      PALABRA: s.keyword,
      GÉNERO: s.genre,
      "PISTA ESPECIAL": s.special,
    }) as Record<string, string>
  )[key];
export default function HostGamePage() {
  const nav = useNavigate();
  const {
    game,
    spinRoulette,
    addPointsToCurrentTeam,
    nextTurn,
    resetDemo,
    awardTeam,
    applyCard,
    changeSong,
  } = useGame();
  const [showAudio, setShowAudio] = useState(false);
  const [message, setMessage] = useState(
    "Gira la rocola para recibir una pista.",
  );
  const [seconds, setSeconds] = useState(game.settings.answerTime);
  const [running, setRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [card, setCard] = useState<(typeof cards)[number] | null>(null);
  const [target, setTarget] = useState(0);
  const [stealing, setStealing] = useState<number | null>(null);
  const team = game.teams[game.currentTeamIndex];
  const song = songs[(game.currentSongNumber - 1) % songs.length];
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    setSeconds(
      stealing === null ? game.settings.answerTime : game.settings.stealTime,
    );
    setRunning(false);
    setShowAnswer(false);
    setShowAudio(false);
  }, [
    game.currentSongNumber,
    game.currentTeamIndex,
    stealing,
    game.settings.answerTime,
    game.settings.stealTime,
  ]);
  const spin = () => {
    const c = spinRoulette();
    if (c === "SIN PISTAS") {
      setMessage("No quedan pistas disponibles.");
      return c;
    }
    if (c === "AUDIO") {
      setShowAudio(true);
      setMessage(
        "🎧 Pista de audio desbloqueada. Pulsa REPRODUCIR para escuchar.",
      );
    } else {
      setMessage(`${c}: ${clueText(c, song)}`);
    }
    setSeconds(game.settings.answerTime);
    setRunning(true);
    return c;
  };
  const success = () => {
    if (stealing !== null) {
      awardTeam(stealing, 2);
      setMessage(`¡ROBO válido! ${game.teams[stealing].name} gana 2 puntos.`);
      setStealing(null);
    } else {
      addPointsToCurrentTeam();
      setMessage(`¡Acierto! ${team.name} gana ${game.currentPoints} puntos.`);
    }
    setRunning(false);
    setShowAnswer(true);
  };
  const newTurn = () => {
    nextTurn();
    setStealing(null);
    setCard(null);
    setMessage("Nuevo turno: gira la rocola.");
    setShowAnswer(false);
    setShowAudio(false);
    setRunning(false);
  };
  const drawCard = () => {
    setCard(cards[Math.floor(Math.random() * cards.length)]);
    setTarget((game.currentTeamIndex + 1) % game.teams.length);
  };
  return (
    <main className="screen">
      <header className="topbar">
        <Logo compact />
        <div className="host-meta">
          <span>SALA {game.roomCode}</span>
          <span>RONDA {game.round}</span>
          <span>CANCIÓN #{game.currentSongNumber}</span>
        </div>
        <NeonButton
          variant="blue"
          onClick={() => {
            resetDemo();
            nav("/home");
          }}
        >
          SALIR
        </NeonButton>
      </header>
      <ScoreBoard teams={game.teams} currentTeamId={team.id} />
      {game.status === "FINAL" && (
        <NeonCard>
          <h2>🏆 RONDA FINAL</h2>
          <p>
            Se alcanzó la meta. Jueguen la última canción; al finalizar, el
            mayor puntaje gana.
          </p>
        </NeonCard>
      )}
      {game.status === "FINISHED" && (
        <NeonCard>
          <h1>🏆 PARTIDA FINALIZADA</h1>
          <p>
            Ganador:{" "}
            {game.teams
              .slice()
              .sort((a, b) => b.score - a.score)
              .filter(
                (t) => t.score === Math.max(...game.teams.map((x) => x.score)),
              )
              .map((t) => t.name)
              .join(" / ")}
          </p>
        </NeonCard>
      )}
      <div className="game-layout">
        <NeonCard className="turn-panel">
          <div className="eyebrow">TURNO ACTUAL</div>
          <div className="current-team-icon">{team.icon}</div>
          <h1>{team.name}</h1>
          <div className="points-panel">
            <span>Valor actual</span>
            <strong>{"⭐".repeat(game.currentPoints)}</strong>
            <small>{game.currentPoints} puntos</small>
          </div>
          <div className="clue-progress">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={
                  i < game.usedClues.length
                    ? "clue-dot clue-dot--used"
                    : "clue-dot"
                }
              />
            ))}
          </div>
          <h2>⏱ {seconds}s</h2>
          <NeonButton variant="blue" onClick={() => setRunning((r) => !r)}>
            {running ? "⏸ PAUSAR" : "▶ INICIAR TIEMPO"}
          </NeonButton>
        </NeonCard>
        <NeonCard className="roulette-panel">
          <div className="eyebrow">CANCIÓN #{game.currentSongNumber}</div>
          <Roulette onSpin={spin} />
          <SongPlayer
            audioUrl={song.audioUrl}
            enabled={showAudio}
            onClose={() => setShowAudio(false)}
          />
          <p>{message}</p>
          <p>Pistas usadas: {game.usedClues.join(", ") || "Ninguna"}</p>
          {showAnswer && (
            <p>
              <strong>
                Respuesta: {song.title} — {song.artist}
              </strong>
            </p>
          )}
          <NeonButton variant="blue" onClick={() => setShowAnswer(true)}>
            👁 REVELAR RESPUESTA
          </NeonButton>
        </NeonCard>
        <NeonCard className="host-controls">
          <h2>CONTROL HOST</h2>
          {stealing !== null && (
            <p>
              🔥 ROBO de {game.teams[stealing].name} — ¡3 segundos para empezar
              a cantar! Se puede encadenar otro robo.
            </p>
          )}
          <NeonButton
            variant="yellow"
            onClick={success}
            disabled={game.status === "FINISHED"}
          >
            ✅ {stealing !== null ? "ROBO VÁLIDO" : "ACERTÓ"}
          </NeonButton>
          <NeonButton
            onClick={() => {
              setMessage(
                "Respuesta incorrecta. Otros equipos pueden intentar robar.",
              );
              setRunning(false);
            }}
          >
            ❌ FALLÓ
          </NeonButton>
          <p>🔥 Selecciona quién grita ROBO:</p>
          {game.teams.map((t, i) => (
            <NeonButton
              key={t.id}
              variant="blue"
              onClick={() => {
                setStealing(i);
                setSeconds(game.settings.stealTime);
                setRunning(true);
                setMessage(`¡${t.name} intenta robar!`);
              }}
            >
              {t.name}
            </NeonButton>
          ))}
          <NeonButton variant="blue" onClick={newTurn}>
            SIGUIENTE TURNO →
          </NeonButton>
          <NeonButton onClick={drawCard}>🃏 SACAR CARTA</NeonButton>
          <NeonButton
            variant="blue"
            onClick={() => {
              changeSong();
              setShowAudio(false);
              setMessage("Canción cambiada.");
            }}
          >
            🔀 CAMBIAR CANCIÓN
          </NeonButton>
        </NeonCard>
      </div>
      {card && (
        <NeonCard>
          <h2>🃏 {card.title}</h2>
          <p>{card.description}</p>
          {["minus", "skip"].includes(card.kind) && (
            <label>
              Equipo objetivo{" "}
              <select
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              >
                {game.teams.map((t, i) => (
                  <option key={t.id} value={i}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <NeonButton
            variant="yellow"
            onClick={() => {
              applyCard(card.kind, target);
              setCard(null);
            }}
          >
            APLICAR CARTA
          </NeonButton>
        </NeonCard>
      )}
      <footer className="game-footer">
        <span>
          🃏 Carta cada {game.settings.cardEveryTurns} turnos (manual)
        </span>
        <span>🔥 Robo: {game.settings.stealTime}s</span>
        <span>🏆 Meta: {game.settings.targetScore}</span>
      </footer>
    </main>
  );
}
