import { useSearchParams, useNavigate } from 'react-router-dom';

export default function FilterBox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const current = searchParams.get('filter') ?? '';

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter) params.set('filter', filter);
    else params.delete('filter');
    navigate(`/pots?${params.toString()}`);
  };

  return (
    <div className="filter-box">
      <button
        className={`btn-filter ${current === '' ? 'active' : ''}`}
        onClick={() => handleFilter('')}
      >
        전체
      </button>
      <button
        className={`btn-filter ${current === 'open' ? 'active' : ''}`}
        onClick={() => handleFilter('open')}
      >
        모집 중
      </button>
      <button
        className={`btn-filter ${current === 'closed' ? 'active' : ''}`}
        onClick={() => handleFilter('closed')}
      >
        마감
      </button>
    </div>
  );
}