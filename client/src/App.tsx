import { Navigate, Route, Routes } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import RulesPage from './pages/RulesPage';
import CreateGamePage from './pages/CreateGamePage';
import HostLobbyPage from './pages/HostLobbyPage';
import HostGamePage from './pages/HostGamePage';

export default function App() {
  return <Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/rules" element={<RulesPage />} />
    <Route path="/host/create" element={<CreateGamePage />} />
    <Route path="/host/lobby/:roomCode" element={<HostLobbyPage />} />
    <Route path="/host/game/:roomCode" element={<HostGamePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
