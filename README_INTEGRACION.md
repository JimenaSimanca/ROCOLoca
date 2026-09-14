# ROCOLoca V0.1 — Host

Primer borrador funcional del Host.

## Incluye
- Splash
- Home
- Reglas
- Crear partida
- Lobby con equipos mock
- Tablero del Host
- Marcador
- Cambio de turno/ronda
- Ruleta simulada
- Puntuación
- Diseño responsive neón

## Dependencia
```bash
npm install react-router-dom
```

## Integración
Copia `client/src` dentro de tu frontend actual. Luego:
```bash
npm install
npm run dev
```

Flujo: `/` → `/home` → `/host/create` → `/host/lobby/:roomCode` → `/host/game/:roomCode`.

El QR es temporal. Socket.IO y conexión móvil entran en V0.3.
