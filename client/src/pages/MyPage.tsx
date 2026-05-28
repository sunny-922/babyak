import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type User, type Pot, type Application } from '../types';
import { getPots } from '../api/potApi';
import { getApplications } from '../api/applicationApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User; }

export default function MyPage({ user }: Props) {
  const [myPots, setMyPots] = useState<Pot[]>([]);
  const [myApplications, setMyApplications] = useState<(Application & { pot?: Pot })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'created' | 'applied'>('created');

  useEffect(() => {
    setLoading(true);
    getPots()
      .then(res => {
        const all = res.data ?? [];
        setMyPots(all.filter(p => p.creatorId === user.id));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  const statusLabel: Record<string, string> = {
    pending: '⏳ 대기 중',
    approved: '✅ 승인',
    rejected: '❌ 거절',
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-container">
      <div className="mypage-header">
        <div className="user-info">
          <h2>{user.nickname}님</h2>
          <p>{user.school} · {user.grade}</p>
          <p>아이디: {user.username}</p>
        </div>
      </div>

      <div className="tab-bar">
        <button
          className={`tab ${tab === 'created' ? 'active' : ''}`}
          onClick={() => setTab('created')}
        >
          내가 만든 팟 ({myPots.length})
        </button>
        <button
          className={`tab ${tab === 'applied' ? 'active' : ''}`}
          onClick={() => setTab('applied')}
        >
          신청한 팟
        </button>
      </div>

      {tab === 'created' && (
        <div className="mypage-section">
          {myPots.length === 0
            ? <p className="empty">만든 팟이 없습니다. <Link to="/pots/new">팟 만들기</Link></p>
            : myPots.map(pot => (
              <Link to={`/pots/${pot.id}`} key={pot.id} className="mypage-pot-item">
                <span className={`badge ${pot.status === 'open' ? 'badge-open' : 'badge-closed'}`}>
                  {pot.status === 'open' ? '모집 중' : '마감'}
                </span>
                <span className="mypage-pot-title">{pot.title}</span>
                <span className="mypage-pot-date">
                  {new Date(pot.meetingTime).toLocaleDateString()}
                </span>
              </Link>
            ))
          }
        </div>
      )}

      {tab === 'applied' && (
        <div className="mypage-section">
          {myApplications.length === 0
            ? <p className="empty">신청한 팟이 없습니다.</p>
            : myApplications.map(app => (
              <div key={app.id} className={`mypage-app-item status-${app.status}`}>
                <span>{statusLabel[app.status]}</span>
                <span>팟 #{app.potId}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}