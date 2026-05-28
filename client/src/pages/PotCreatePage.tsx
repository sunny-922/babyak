import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPot } from '../api/potApi';
import PotForm, { type PotFormData } from '../components/PotForm';

export default function PotCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: PotFormData) => {
    setLoading(true);
    try {
      const res = await createPot(data);
      navigate(`/pots/${res.data!.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← 뒤로</button>
        <h2>새 팟 만들기</h2>
      </div>
      <PotForm onSubmit={handleSubmit} submitLabel="팟 만들기" loading={loading} />
    </div>
  );
}