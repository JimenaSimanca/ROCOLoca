export type Player = { id: string; name: string; connected: boolean; teamIndex?: number };

export const wsUrl = import.meta.env.VITE_REALTIME_URL || '';

export function connectRoom(
  code: string,
  role: 'host' | 'player',
  onMessage: (message: any) => void,
  name?: string
): WebSocket | null {
  if (!wsUrl) return null;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: role === 'player' ? 'join' : 'host',
      code,
      ...(role === 'player' ? { name, playerId: getPlayerId() } : {}),
    }));
  };

  ws.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch (error) {
      console.error('Mensaje de sala inválido:', error);
    }
  };

  ws.onerror = () => {
    onMessage({ type: 'error', message: 'No se pudo conectar al servidor de ROCOLoca.' });
  };

  ws.onclose = (event) => {
    if (event.code !== 1000) {
      onMessage({ type: 'error', message: 'Se perdió la conexión con la sala. Intenta ingresar de nuevo.' });
    }
  };

  return ws;
}

export function getPlayerId(): string {
  let id = sessionStorage.getItem('roco-player-id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('roco-player-id', id);
  }
  return id;
}

export function send(ws: WebSocket | null, message: object): void {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
