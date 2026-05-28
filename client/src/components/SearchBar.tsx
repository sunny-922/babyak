import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(searchParams.get('search') ?? '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (input.trim()) params.set('search', input.trim());
    else params.delete('search');
    navigate(`/pots?${params.toString()}`);
  };

  const handleClear = () => {
    setInput('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    navigate(`/pots?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="팟 이름, 장소로 검색..."
        className="search-input"
      />
      {input && (
        <button type="button" onClick={handleClear} className="btn-clear">✕</button>
      )}
      <button type="submit" className="btn-primary">검색</button>
    </form>
  );
}