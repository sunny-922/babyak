import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPots } from '../api/potApi';
import { type Pot, type User } from '../types';
import PotCard from '../components/PotCard';
import SearchBar from '../components/SearchBar';
import FilterBox from '../components/FilterBox';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User | null; }

export default function PotListPage({ user }: Props) {
  const [searchParams] = useSearchParams();
  const [pots, setPots] = useState<Pot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') ?? '';
  const filter = searchParams.get('filter') ?? '';

  useEffect(() => {
    setLoading(true);
    setError('');
    getPots(search, filter)
      .then(res => setPots(res.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, filter]);

  return (
    <div className="page-container">
      <div className="list-header">
        <h2>밥약팟 목록</h2>
      </div>
      <SearchBar />
      <FilterBox />
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