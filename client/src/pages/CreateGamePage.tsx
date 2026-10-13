import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import NeonCard from "../components/common/NeonCard";
import NeonButton from "../components/common/NeonButton";
import { useGame } from "../context/GameContext";
export default function CreateGamePage() {
  const n = useNavigate();
  const { createGame } = useGame();
  const [teamCount, setTeamCount] = useState(4),
    [targetScore, setTargetScore] = useState(15),
    [answerTime, setAnswerTime] = useState(20),
    [stealTime, setStealTime] = useState(3),
    [cardEveryTurns, setCardEveryTurns] = useState(3);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const c = createGame({
      teamCount,
      targetScore,
      answerTime,
      stealTime,
      cardEveryTurns,
    });
    n(`/host/lobby/${c}`);
  };
  return (
    <main className="screen">
      <header className="topbar">
        <Logo compact />
        <NeonButton variant="blue" onClick={() => n("/home")}>
          ← VOLVER
        </NeonButton>
      </header>
      <NeonCard className="settings-card">
        <h1>NUEVA PARTIDA</h1>
        <form className="settings-form" onSubmit={submit}>
          <label>
            Número de equipos
            <select
              value={teamCount}
              onChange={(e) => setTeamCount(+e.target.value)}
            >
              <option value={2}>2 equipos</option>
              <option value={3}>3 equipos</option>
              <option value={4}>4 equipos</option>
            </select>
          </label>
          <label>
            Puntos para activar la final
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(+e.target.value)}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </label>
          <label>
            Tiempo para responder
            <input
              type="number"
              value={answerTime}
              onChange={(e) => setAnswerTime(+e.target.value)}
            />
          </label>
          <label>
            Tiempo para iniciar ROBO
            <input
              type="number"
              value={stealTime}
              onChange={(e) => setStealTime(+e.target.value)}
            />
          </label>
          <label>
            Carta sorpresa cada
            <input
              type="number"
              value={cardEveryTurns}
              onChange={(e) => setCardEveryTurns(+e.target.value)}
            />
          </label>
          <NeonButton type="submit">CREAR PARTIDA</NeonButton>
        </form>
      </NeonCard>
    </main>
  );
}
