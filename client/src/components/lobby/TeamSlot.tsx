import type { Team } from "../../models/Team";
export default function TeamSlot({ team }: { team: Team }) {
  return (
    <div className="team-slot">
      <div className="team-slot__id">{team.id}</div>
      <div className="team-slot__icon">{team.icon}</div>
      <div>
        <strong>{team.name}</strong>
        <div className="team-slot__status">
          <span className="status-dot" /> conectado
        </div>
      </div>
    </div>
  );
}
