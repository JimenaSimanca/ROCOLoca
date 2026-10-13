import { useEffect, useRef, useState } from 'react';
import NeonButton from '../common/NeonButton';
import './Roulette.css';

const sectors = [
  { label: 'ARTISTA', icon: '🎤', key: 'ARTISTA' },
  { label: 'AÑO', icon: '📅', key: 'AÑO' },
  { label: 'GÉNERO', icon: '🎶', key: 'GÉNERO' },
  { label: 'INTRO', icon: '💿', key: 'PISTA ESPECIAL' },
  { label: 'PALABRA', icon: '💬', key: 'PALABRA' },
  { label: 'SORPRESA', icon: '🎬', key: 'PISTA ESPECIAL' },
];

export default function Roulette({ onSpin }: { onSpin: () => string }) {
  const [result, setResult] = useState('¡Gira para descubrir una pista!');
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const rotation = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult('✨ GIRANDO...');
    // El resultado proviene del motor del juego, no de la decoración visual.
    const clue = onSpin();
    const index = sectors.findIndex(s => s.key === clue);
    const selected = index >= 0 ? index : Math.floor(Math.random() * sectors.length);
    const current = ((rotation.current % 360) + 360) % 360;
    const desired = (360 - selected * 60) % 360;
    const delta = (desired - current + 360) % 360;
    rotation.current += 1800 + delta;
    setAngle(rotation.current);
    timer.current = window.setTimeout(() => {
      setResult(clue === 'SIN PISTAS' ? 'No quedan pistas disponibles' : `✨ ${clue}`);
      setSpinning(false);
    }, 3500);
  };

  return <div className="roco-roulette">
    <div className="roco-roulette__stage">
      <div className="roco-roulette__pointer" aria-hidden="true" />
      <div className="roco-roulette__wheel" style={{ transform: `rotate(${angle}deg)` }}>
        {sectors.map((sector, i) => {
          const radians = (i * 60 - 90) * Math.PI / 180;
          return <div className="roco-roulette__sector" key={i} style={{ left: `${50 + 33 * Math.cos(radians)}%`, top: `${50 + 33 * Math.sin(radians)}%`, transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}>
            <span className="roco-roulette__number">{i + 1}</span>
            <span className="roco-roulette__icon">{sector.icon}</span>
            <span className="roco-roulette__label">{sector.label}</span>
          </div>;
        })}
        <div className="roco-roulette__vinyl" aria-hidden="true"><span>♫</span></div>
      </div>
    </div>
    <div className="roco-roulette__result" aria-live="polite">{result}</div>
    <NeonButton onClick={spin} disabled={spinning}>{spinning ? '🎵 GIRANDO...' : '🎰 GIRAR ROCOLA'}</NeonButton>
  </div>;
}
