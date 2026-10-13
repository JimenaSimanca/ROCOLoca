# ROCOLoca V0.2 — Demo jugable

## Cambios
- 12 canciones de demostración, pistas no repetidas, puntuación decreciente.
- Temporizador configurable para respuestas y robos.
- Selección manual de equipos para robo y robo encadenado.
- Cartas con efectos sobre marcador, orden y turnos.
- Ronda final y ganador.

## Importante
La validación de canciones y robos es manual desde el Host. El modo online, audio y sincronización Socket.IO todavía no están implementados. Los equipos del lobby son simulados. Los datos se reinician al recargar. La carta se saca manualmente.

## Instalación
En la raíz: `npm install`, `npm run build`, `npm run dev`.
Para Vercel mantener Root Directory `./`, Build `npm run build`, Output `dist`.
