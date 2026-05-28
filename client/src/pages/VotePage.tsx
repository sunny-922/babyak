import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type User, type Vote } from '../types';
import { getVotes, createVote } from '../api/voteApi';
import VoteBox from '../components/VoteBox';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User | null; }

export default function VotePage({ user }: Props) {
  const { potId } = useParams<{ potId: string }>();
  const navigate = useNavigate();

  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newVote, setNewVote] = useState({ title: '', type: '단일', options: ['', ''] });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getVotes(Number(potId))
      .then(res => setVotes(res.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [potId]);

  const handleAddOption = () => {
    setNewVote(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const handleOptionChange = (idx: number, value: string) => {
    setNewVote(prev => {
      const options = [...prev.options];
      options[idx] = value;
      return { ...prev, options };
    });
  };

  const handleCreateVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVote.title) { alert('투표 제목을 입력하세요.'); return; }
    const validOptions = newVote.options.filter(o => o.trim());
    if (validOptions.length < 2) { alert('선택지를 2개 이상 입력하세요.'); return; }

    setCreating(true);
    try {
      const res = await createVote(Number(potId), {
        title: newVote.title,
        type: newVote.type,
        options: validOptions,
      });
      setVotes(prev => [...prev, res.data!]);
      setShowForm(false);
      setNewVote({ title: '', type: '단일', options: ['', ''] });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← 뒤로</button>
        <h2>투표</h2>
        {user && (
          <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '취소' : '+ 투표 만들기'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateVote} className="vote-create-form">
          <div className="form-group">
            <label>투표 제목</label>
            <input
              value={newVote.title}
              onChange={e => setNewVote(p => ({ ...p, title: e.target.value }))}
              placeholder="무엇을 투표할까요?"
            />
          </div>
          <div className="form-group">
            <label>선택지</label>
            {newVote.options.map((opt, idx) => (
              <input
                key={idx}
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                placeholder={`선택지 ${idx + 1}`}
                className="vote-option-input"
              />
            ))}
            <button type="button" className="btn-text" onClick={handleAddOption}>
              + 선택지 추가
            </button>
          </div>
          <button type="submit" className="btn-primary" disabled={creating}>
            {creating ? '생성 중...' : '투표 생성'}
          </button>
        </form>
      )}

      {votes.length === 0
        ? <p className="empty">아직 투표가 없습니다.</p>
        : votes.map(vote => (
          <VoteBox key={vote.id} vote={vote} userId={user?.id ?? null} />
        ))
      }
    </div>
  );
}