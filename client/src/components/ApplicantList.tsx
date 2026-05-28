import { type Application } from '../types';

interface Props {
  applications: Application[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const statusLabel: Record<string, string> = {
  pending: '대기 중',
  approved: '승인',
  rejected: '거절',
};

export default function ApplicantList({ applications, onApprove, onReject }: Props) {
  if (applications.length === 0) {
    return <p className="empty">아직 신청자가 없습니다.</p>;
  }

  return (
    <div className="applicant-list">
      <h4>신청자 목록 ({applications.length}명)</h4>
      {applications.map(app => (
        <div key={app.id} className={`applicant-item status-${app.status}`}>
          <div className="applicant-info">
            <span className="applicant-name">{app.user.nickname}</span>
            {app.message && <span className="applicant-message">"{app.message}"</span>}
            <span className={`badge badge-${app.status}`}>{statusLabel[app.status]}</span>
          </div>
          {app.status === 'pending' && (
            <div className="applicant-actions">
              <button className="btn-approve" onClick={() => onApprove(app.id)}>승인</button>
              <button className="btn-reject" onClick={() => onReject(app.id)}>거절</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}