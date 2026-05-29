import { useState } from 'react';
import { type Vote } from '../types';
import { respondToVote, getVoteResults } from '../api/voteApi';

interface Props {
  vote: Vote;
  userId: number | null;
}

export default function VoteBox({ vote, userId }: Props) {
  const [results, setResults] = useState<{ optionId: number; count: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async (optionId: number) => {
    if (!userId || voted) return;
    setLoading(true);
    try {
      await respondToVote(vote.id, optionId);
      setVoted(true);
      const res = await getVoteResults(vote.id);
      setResults(res.data ?? []);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowResults = async () => {
    setLoading(true);
    try {
      const res = await getVoteResults(vote.id);
      setResults(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = results?.reduce((sum, r) => sum + r.count, 0) ?? 0;

  return (
    <div className="vote-box">
      <h4>{vote.title}</h4>
      {!userId && (
        <p className="vote-permission-denied">승인된 참가자만 투표에 참여할 수 있습니다.</p>
      )}
      <div className="vote-options">
        {vote.options.map(option => {
          const result = results?.find(r => r.optionId === option.id);
          const pct = totalVotes > 0 ? Math.round((result?.count ?? 0) / totalVotes * 100) : 0;
          return (
            <div key={option.id} className="vote-option">
              <button
                className="btn-vote"
                onClick={() => handleVote(option.id)}
                disabled={!userId || voted || loading}
              >
                {option.content}
              </button>
              {results && (
                <div className="vote-result">
                  <div className="vote-bar" style={{ width: `${pct}%` }} />
                  <span>{result?.count ?? 0}표 ({pct}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!results && (
        <button className="btn-text" onClick={handleShowResults} disabled={loading}>
          결과 보기
        </button>
      )}
    </div>
  );
}