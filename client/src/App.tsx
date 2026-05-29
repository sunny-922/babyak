import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './api/hooks/useAuth';
import Header from './components/Header';
import LoginPage from './pages/LoginPage.tsx';
import SignupPage from './pages/SignupPage';
import PotListPage from './pages/PotListPage';
import PotCreatePage from './pages/PotCreatePage';
import PotDetailPage from './pages/PotDetailPage';
import MyPage from './pages/MyPage';
import VotePage from './pages/VotePage';
import ExplorePage from './pages/ExplorePage';

function App() {
  const auth = useAuth();

  if (auth.loading) return <div>로딩 중...</div>;

  return (
    <BrowserRouter>
      <Header user={auth.user} onLogout={auth.logout} />
      <Routes>
        <Route path="/login" element={<LoginPage setUser={auth.setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pots" element={<PotListPage />} />
        <Route path="/pots/new" element={
          auth.user ? <PotCreatePage /> : <Navigate to="/login" />
        } />
        <Route path="/pots/:potId" element={<PotDetailPage user={auth.user} />} />
        <Route path="/pots/:potId/votes" element={<VotePage user={auth.user} />} />
        <Route path="/mypage" element={
          auth.user ? <MyPage user={auth.user} /> : <Navigate to="/login" />
        } />
        <Route path="/explore" element={<ExplorePage user={auth.user} />} />
        <Route path="/" element={<Navigate to="/pots" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;