# ROCOLoca — instrucciones para entregar

## Qué se completó
- 12 fragmentos de audio aportados por el usuario, con nombres corregidos a `.mp3` para coincidir con `songs.ts`.
- Reproductor de audio corregido (`enabled`, `onClose`).
- Código QR real y enlace de invitación `/join/CODIGO`.
- Pantalla de jugador desde móvil, elección de equipo, puntuaciones y estado de partida.
- Servidor WebSocket para salas y sincronización desde el Host.
- Temporizador predeterminado de 20 segundos.

## Paso 1 — servidor de tiempo real (Render, Railway o similar)
Crea un **Web Service** desde el repositorio GitHub.
- Root directory: `realtime`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/`
Copia la URL pública `https://...` y reemplaza `https` por `wss`.

## Paso 2 — frontend Vercel
Agrega en Environment Variables:
`VITE_REALTIME_URL=wss://TU-SERVIDOR.onrender.com`
Redeploy. En Vercel, la aplicación necesita reescritura SPA (`vercel.json` incluido).

## Paso 3 — prueba de dos dispositivos
1. Abre el Host en un PC y crea una sala.
2. En el móvil, escanea el QR y escribe un nombre.
3. Verifica que aparece en Jugadores conectados del lobby.
4. Elige un equipo desde el móvil.
5. Host inicia partida y gira ruleta; el móvil muestra canción/turno y puntajes actualizados.

## Advertencias
- El QR se renderiza con `api.qrserver.com`; requiere internet.
- La sala vive en memoria del servidor. Si Render reinicia el proceso, se pierde la sala; para una entrega estable, mantén Host conectado y usa una instancia sin suspensión.
- El servidor no tiene autenticación ni persistencia; es una solución de demostración, no de producción.
- Los archivos de música aportados deben utilizarse únicamente si se tienen los derechos/licencias necesarios para publicarlos.
- No se han comprobado las dependencias ni la compilación final en este entorno; ejecutar `npm install && npm run build` antes del despliegue.
