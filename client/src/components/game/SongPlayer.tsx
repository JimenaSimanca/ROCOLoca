
import { useEffect, useRef, useState } from 'react';

interface SongPlayerProps {
  audioUrl?: string;
  enabled: boolean;
  onClose: () => void;
}

export default function SongPlayer({ audioUrl }: SongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, [audioUrl]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error('Error al reproducir audio:', error);
      }
    } else {
      audio.pause();
    }
  };

  if (!audioUrl) {
    return <p>Esta canción no tiene audio disponible.</p>;
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
      />

      <button type="button" onClick={toggleAudio}>
        {playing ? '⏸ Pausar audio' : '▶ Reproducir pista'}
      </button>
    </div>
  );
}
