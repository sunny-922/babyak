import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { type User, type Pot } from '../types';
import { getPots } from '../api/potApi';
import { getMyApplications } from '../api/applicationApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User; }

type MyApplication = {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
  pot: { id: number; title: string; status: string; meetingTime: string };
};

export default function MyPage({ user }: Props) {
  const [myPots, setMyPots] = useState<Pot[]>([]);
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'created' | 'applied'>('created');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPots(),
      getMyApplications(),
    ])
      .then(([potsRes, appsRes]) => {
        const all = potsRes.data ?? [];
        setMyPots(all.filter(p => p.creatorId === user.id));
        setMyApplications((appsRes as any).data ?? []);
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
          <p>{user.studentNumber}</p>
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
          신청한 팟 ({myApplications.length})
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
                  {pot.meetingTime ? new Date(pot.meetingTime).toLocaleDateString() : '일정 미정'}
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
              <Link to={`/pots/${app.pot.id}`} key={app.id} className="mypage-pot-item">
                <span className={`badge status-badge-${app.status}`}>{statusLabel[app.status]}</span>
                <span className="mypage-pot-title">{app.pot.title}</span>
                <span className="mypage-pot-date">
                  {app.pot.meetingTime ? new Date(app.pot.meetingTime).toLocaleDateString() : '일정 미정'}
                </span>
              </Link>
            ))
          }
        </div>
      )}
    </div>
  );
}
