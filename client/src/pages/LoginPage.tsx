import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getMe } from '../api/authApi';
import { type User } from '../types';

interface Props {
  setUser: (user: User) => void;
}

export default function LoginPage({ setUser }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) { setError('아이디를 입력하세요.'); return; }
    if (!password) { setError('비밀번호를 입력하세요.'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await login({ username, password });
      const token = (res as any).data?.token ?? (res as any).token;
      if (!token) throw new Error('로그인 응답이 올바르지 않습니다.');
      localStorage.setItem('token', token);
      const meRes = await getMe();
      const me = (meRes as any).data ?? meRes;
      setUser(me);
      navigate('/pots');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="아이디 입력"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="auth-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}