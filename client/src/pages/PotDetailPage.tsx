import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPotById, deletePot, updatePot } from '../api/potApi';
import { getApplications, applyToPot, approveApplication, rejectApplication } from '../api/applicationApi';
import { type Pot, type Application, type User } from '../types';
import ApplicantList from '../components/ApplicantList';
import PotForm, { type PotFormData } from '../components/PotForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

interface Props { user: User | null; }

export default function PotDetailPage({ user }: Props) {
  const { potId } = useParams<{ potId: string }>();
  const navigate = useNavigate();

  const [pot, setPot] = useState<Pot | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  const isOwner = user?.id === pot?.creatorId;
  const myApplication = applications.find(a => a.user_id === user?.id);
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const currentCount = approvedCount + 1;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPotById(Number(potId)),
      getApplications(Number(potId)).catch(() => ({ data: [] as Application[] })),
    ])
      .then(([potRes, appRes]) => {
        setPot((potRes as any).data ?? potRes as any);
        setApplications((appRes as any).data ?? appRes as any ?? []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [potId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToPot(Number(potId), applyMessage);
      const res = await getApplications(Number(potId));
      setApplications((res as any).data ?? res as any ?? []);
      setApplyMessage('');
      alert('신청 완료!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApplying(false);
    }
  };

  const handleApprove = async (id: number) => {
    await approveApplication(id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleReject = async (id: number) => {
    await rejectApplication(id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  const handleDelete = async () => {
    if (!confirm('정말 이 팟을 삭제하시겠어요?')) return;
    try {
      await deletePot(Number(potId));
      navigate('/pots');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdate = async (data: PotFormData) => {
    try {
      await updatePot(Number(potId), data);
      setPot(prev => prev ? { ...prev, ...data } : prev);
      setIsEditing(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <Loading />;
  if (error || !pot) return <ErrorMessage message={error || '팟을 찾을 수 없습니다.'} />;

  if (isEditing) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="btn-back" onClick={() => setIsEditing(false)}>← 취소</button>
          <h2>팟 수정</h2>
        </div>
        <PotForm
          initialData={pot}
          onSubmit={handleUpdate}
          submitLabel="수정 완료"
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← 뒤로</button>
        <span className={`badge ${pot.status === 'open' ? 'badge-open' : 'badge-closed'}`}>
          {pot.status === 'open' ? '모집 중' : '마감'}
        </span>
      </div>

      <div className="pot-detail">
        <h2>{pot.title}</h2>
        <p className="pot-detail-creator">by {pot.creator.nickname}</p>
        <p className="pot-detail-desc">{pot.description}</p>

        <div className="pot-detail-info">
          <div>📍 <strong>장소</strong> {pot.place}</div>
          <div>📅 <strong>일시</strong> {new Date(pot.meetingTime).toLocaleString()}</div>
          <div>👥 <strong>인원</strong> {currentCount} / {pot.maxPeople}명</div>
        </div>

        {isOwner && (
          <div className="owner-actions">
            <button className="btn-secondary" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn-danger" onClick={handleDelete}>삭제</button>
            <Link to={`/pots/${potId}/votes`} className="btn-secondary">투표 관리</Link>
          </div>
        )}

        {user && (myApplication?.status === 'approved' || isOwner) && !isOwner && (
          <div className="vote-section">
            <Link to={`/pots/${potId}/votes`} className="btn-secondary">투표</Link>
          </div>
        )}

        {user && !isOwner && (
          <div className="apply-section">
            {myApplication ? (
              <div className={`my-application status-${myApplication.status}`}>
                내 신청 상태: <strong>
                  {myApplication.status === 'pending' ? '대기 중'
                    : myApplication.status === 'approved' ? '✅ 승인'
                    : '❌ 거절'}
                </strong>
              </div>
            ) : pot.status === 'open' ? (
              <>
                <input
                  value={applyMessage}
                  onChange={e => setApplyMessage(e.target.value)}
                  placeholder="신청 메시지 (선택)"
                  className="apply-message-input"
                />
                <button className="btn-primary" onClick={handleApply} disabled={applying}>
                  {applying ? '신청 중...' : '신청하기'}
                </button>
              </>
            ) : (
              <p className="notice">모집이 마감된 팟입니다.</p>
            )}
          </div>
        )}

        {!user && (
          <p className="notice">
            <Link to="/login">로그인</Link>하면 신청할 수 있습니다.
          </p>
        )}

        {isOwner && (
          <ApplicantList
            applications={applications}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}