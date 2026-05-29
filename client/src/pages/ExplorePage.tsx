import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getPots } from '../api/potApi';
import { type Pot, type User } from '../types';
import PotCard from '../components/PotCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User | null; }

export default function ExplorePage({ user }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pots, setPots] = useState<Pot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const school = searchParams.get('school') ?? '';
  const sort = searchParams.get('sort') ?? 'latest';

  useEffect(() => {
    setLoading(true);
    getPots(school, '')
      .then(res => {
        let data = res.data ?? [];
        if (sort === 'latest') data = [...data].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        if (sort === 'meeting') data = [...data].sort((a, b) => {
          const at = a.meetingTime ? new Date(a.meetingTime).getTime() : Infinity;
          const bt = b.meetingTime ? new Date(b.meetingTime).getTime() : Infinity;
          return at - bt;
        });
        setPots(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [school, sort]);

  const handleSort = (s: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', s);
    navigate(`/explore?${params.toString()}`);
  };

  const handleSchoolFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem('school') as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams);
    if (input) params.set('school', input);
    else params.delete('school');
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="page-container">
      <h2>모임 찾기</h2>

      {user && (
        <p className="notice">
          제목 기준으로 추천 팟을 보여드려요!
        </p>
      )}

      <div className="explore-controls">
        <form onSubmit={handleSchoolFilter} className="school-filter">
          <input name="school" defaultValue={school} placeholder="제목으로 찾기..." />
          <button type="submit" className="btn-primary">검색</button>
        </form>

        <div className="sort-buttons">
          <button
            className={`btn-filter ${sort === 'latest' ? 'active' : ''}`}
            onClick={() => handleSort('latest')}
          >
            최신순
          </button>
          <button
            className={`btn-filter ${sort === 'meeting' ? 'active' : ''}`}
            onClick={() => handleSort('meeting')}
          >
            모임 임박순
          </button>
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        pots.length === 0
          ? <p className="empty">조건에 맞는 팟이 없습니다.</p>
          : <div className="pot-grid">
              {pots.map(pot => <PotCard key={pot.id} pot={pot} />)}
            </div>
      )}
    </div>
  );
}