import { Link, useNavigate } from 'react-router-dom';
import { type User } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/pots');
  };

  return (
    <header className="header">
      <Link to="/pots" className="header-logo">🍚 밥약팟</Link>
      <nav className="header-nav">
        <Link to="/pots">팟 목록</Link>
        <Link to="/explore">모임 찾기</Link>
        {user ? (
          <>
            <Link to="/pots/new">팟 만들기</Link>
            <Link to="/mypage">{user.nickname}</Link>
            <button onClick={handleLogout} className="btn-text">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}