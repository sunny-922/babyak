import { useNavigate } from 'react-router-dom';
import { type Pot } from '../types';

interface Props {
  pot: Pot;
}

export default function PotCard({ pot }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`pot-card ${pot.status === 'closed' ? 'closed' : ''}`}
      onClick={() => navigate(`/pots/${pot.id}`)}
    >
      <div className="pot-card-header">
        <span className={`badge ${pot.status === 'open' ? 'badge-open' : 'badge-closed'}`}>
          {pot.status === 'open' ? '모집 중' : '마감'}
        </span>
        <span className="pot-card-creator">by {pot.creator?.nickname || pot.creator_nickname}</span>
      </div>
      <h3 className="pot-card-title">{pot.title}</h3>
      <p className="pot-card-desc">{pot.description}</p>
      <div className="pot-card-info">
        <span>📍 {pot.place}</span>
        <span>📅 {new Date(pot.meetingTime || pot.meeting_time).toLocaleString()}</span>
        <span>👥 최대 {pot.maxPeople || pot.max_people}명</span>
      </div>
    </div>
  );
}