import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Música original sintetizada con Web Audio: no requiere MP3, licencias ni servicios externos.
export default function AmbientMusic() {
  const location = useLocation();
  const [enabled, setEnabled] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const interval = useRef<number | undefined>(undefined);
  const step = useRef(0);
  const enabledRef = useRef(false);
  const waiting = !location.pathname.startsWith('/host/game/');
  const waitingRef = useRef(waiting);
  waitingRef.current = waiting;

  const stop = () => {
    window.clearInterval(interval.current);
    interval.current = undefined;
    if (audio.current) { void audio.current.close(); audio.current = null; }
  };
  const playTone = (ctx: AudioContext, frequency: number, duration: number, volume: number, type: OscillatorType) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration + .01);
  };
  const start = async () => {
    if (audio.current || !waitingRef.current) return;
    const ctx = new AudioContext(); audio.current = ctx;
    try { await ctx.resume(); } catch { stop(); return; }
    const melody = [261.63,329.63,392,523.25,392,329.63,293.66,392,440,587.33,440,392,329.63,293.66,261.63,196];
    const tick = () => {
      if (!audio.current || !waitingRef.current || !enabledRef.current) return;
      const n = step.current++;
      playTone(ctx,melody[n % melody.length],.26,.025,'triangle');
      if (n % 2 === 0) playTone(ctx,130.81,.19,.015,'sine');
      if (n % 4 === 0) playTone(ctx,65.41,.42,.028,'sine');
    };
    tick(); interval.current = window.setInterval(tick,330);
  };
  const toggle = () => {
    const next = !enabledRef.current;
    enabledRef.current = next; setEnabled(next);
    if (next) void start(); else stop();
  };
  useEffect(() => {
    if (!waiting) stop();
    else if (enabledRef.current) void start();
  }, [waiting]);
  useEffect(() => () => stop(), []);
  return <button type="button" onClick={toggle} aria-label={enabled ? 'Silenciar música ambiental' : 'Activar música ambiental'} aria-pressed={enabled} title="Música ambiental" style={{position:'fixed',right:16,bottom:16,zIndex:1000,padding:'12px 16px',borderRadius:999,border:'1px solid #ff54b6',background:'#210d2deb',color:'#fff',fontWeight:800,boxShadow:'0 0 16px #ff3aa455',cursor:'pointer'}}>{enabled ? '🔊 Música ON' : '🔇 Música OFF'}</button>;
}
