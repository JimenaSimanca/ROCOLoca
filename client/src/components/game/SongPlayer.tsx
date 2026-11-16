
import { useEffect, useRef, useState } from 'react';
import './SongPlayer.css';

interface SongPlayerProps {
  audioUrl?: string;
  enabled: boolean;
  onClose: () => void;
}

export default function SongPlayer({ audioUrl, enabled, onClose }: SongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
    setError('');
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [audioUrl, enabled]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error('Error al reproducir audio:', error);
        setError('No se pudo reproducir este archivo.');
      }
    } else {
      audio.pause();
    }
  };

  if (!enabled) return null;
  if (!audioUrl) {
    return <p className="song-player__error">Esta canción no tiene audio disponible.</p>;
  }

  return (
    <div className="song-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setError('No se encontró el audio de esta canción.')}
      />

      <div className="song-player__actions"><button className="song-player__button" type="button" onClick={toggleAudio}>
        {playing ? '⏸ Pausar audio' : '▶ Reproducir pista'}
      </button>
      <button className="song-player__close" type="button" onClick={onClose}>✕ CERRAR</button></div>
      {error && <p className="song-player__error" role="alert">{error}</p>}
    </div>
  );
}
